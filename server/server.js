#!/usr/bin/env node
/*
 * Project Control Hub – lokal server
 *
 * Två separata origins:
 *   Hub    http://127.0.0.1:4800  – appen, databasen (data/db.json), bilagor
 *   Tools  http://127.0.0.1:4801  – kör användarens HTML-verktyg från user_tools/
 *
 * Verktygen körs på en egen origin så att de inte kan läsa hubbens DOM,
 * localStorage eller API. Hubbens API kräver att skrivande anrop kommer från
 * hubbens egen origin. Inga externa beroenden – bara Node (18+).
 */
'use strict';

const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const VERSION = '0.1.0';

// ---------------------------------------------------------------- config
const DEFAULTS = {
  host: '127.0.0.1',
  hubPort: 4800,
  toolPort: 4801,
  dataDir: 'data',
  toolsDir: 'user_tools',
  maxUploadMB: 200,
  // Framtida PROJECT CONTROL HUB API för egna verktyg. Endast läsning, av som standard.
  toolApi: { enabled: false },
  // Skript som "Hämta uppdateringar" får köra, t.ex. NSV Binder. Definieras bara här, aldrig från webbläsaren.
  scripts: {}
};

function loadConfig() {
  const p = path.join(ROOT, 'config.json');
  let user = {};
  if (fs.existsSync(p)) {
    try { user = JSON.parse(fs.readFileSync(p, 'utf8')); }
    catch (e) { console.error('config.json kunde inte läsas:', e.message); }
  }
  return { ...DEFAULTS, ...user, toolApi: { ...DEFAULTS.toolApi, ...(user.toolApi || {}) }, scripts: { ...(user.scripts || {}) } };
}

const config = loadConfig();
const DATA_DIR = path.resolve(ROOT, config.dataDir);
const DB_FILE = path.join(DATA_DIR, 'db.json');
const ATT_DIR = path.join(DATA_DIR, 'attachments');
const TOOLS_DIR = path.resolve(ROOT, config.toolsDir);
const EXAMPLES_DIR = path.join(ROOT, 'examples', 'tools');
const MAX_BODY = config.maxUploadMB * 1024 * 1024;
const sources = require('./sources.js')({ dataDir: DATA_DIR, config });

const HUB_ORIGINS = new Set([`http://127.0.0.1:${config.hubPort}`, `http://localhost:${config.hubPort}`]);
const HUB_HOSTS = new Set([`127.0.0.1:${config.hubPort}`, `localhost:${config.hubPort}`]);
const TOOL_HOSTS = new Set([`127.0.0.1:${config.toolPort}`, `localhost:${config.toolPort}`]);
// Om användaren medvetet binder till annan host släpper vi host-kontrollen för den.
if (config.host !== '127.0.0.1' && config.host !== 'localhost') {
  HUB_HOSTS.add(`${config.host}:${config.hubPort}`);
  HUB_ORIGINS.add(`http://${config.host}:${config.hubPort}`);
  TOOL_HOSTS.add(`${config.host}:${config.toolPort}`);
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.bmp': 'image/bmp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.pdf': 'application/pdf', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
  '.ifc': 'application/octet-stream', '.eml': 'message/rfc822'
};
const mimeOf = (p) => MIME[path.extname(p).toLowerCase()] || 'application/octet-stream';

// ---------------------------------------------------------------- helpers
/** Löser rel mot base och returnerar null om resultatet hamnar utanför base. */
function safeJoin(base, rel) {
  if (typeof rel !== 'string' || rel.includes('\0')) return null;
  const resolved = path.resolve(base, '.' + path.sep + rel);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) return null;
  return resolved;
}

function decodePath(p) {
  try { return decodeURIComponent(p); } catch { return null; }
}

const isSafeId = (id) => typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(id);

function send(res, status, body, headers = {}) {
  const isBuf = Buffer.isBuffer(body);
  const payload = isBuf || typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': isBuf || typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error('För stor uppladdning'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (!ct.startsWith('application/json')) throw Object.assign(new Error('Content-Type måste vara application/json'), { status: 415 });
  const buf = await readBody(req);
  try { return JSON.parse(buf.toString('utf8')); }
  catch { throw Object.assign(new Error('Ogiltig JSON'), { status: 400 }); }
}

async function writeAtomic(file, data) {
  await fsp.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fsp.writeFile(tmp, data);
  await fsp.rename(tmp, file);
}

async function serveFile(res, file, extraHeaders = {}) {
  try {
    const st = await fsp.stat(file);
    if (!st.isFile()) return send(res, 404, 'Hittades inte');
    res.writeHead(200, {
      'Content-Type': mimeOf(file),
      'Content-Length': st.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders
    });
    fs.createReadStream(file).pipe(res);
  } catch {
    send(res, 404, 'Hittades inte');
  }
}

function slugify(s) {
  return String(s || 'verktyg')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'verktyg';
}

async function listFiles(dir, base = dir) {
  const out = [];
  let entries = [];
  try { entries = await fsp.readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await listFiles(full, base));
    else if (e.isFile()) {
      const st = await fsp.stat(full);
      out.push({ path: path.relative(base, full).split(path.sep).join('/'), size: st.size });
    }
  }
  return out;
}

async function copyDir(src, dst) {
  await fsp.mkdir(dst, { recursive: true });
  for (const e of await fsp.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isFile()) await fsp.copyFile(s, d);
  }
}

// ---------------------------------------------------------------- hub
const STATIC_ROOTS = ['css', 'js', 'assets', 'examples'];

let lastBackup = 0;
async function saveDb(json) {
  // Behåll en säkerhetskopia av föregående version, högst var tionde minut.
  if (Date.now() - lastBackup > 10 * 60 * 1000 && fs.existsSync(DB_FILE)) {
    await fsp.copyFile(DB_FILE, path.join(DATA_DIR, 'db.backup.json')).catch(() => {});
    lastBackup = Date.now();
  }
  await writeAtomic(DB_FILE, json);
}

async function handleHub(req, res) {
  const host = (req.headers.host || '').toLowerCase();
  if (!HUB_HOSTS.has(host)) return send(res, 421, 'Okänd host');

  const url = new URL(req.url, `http://${host}`);
  const p = url.pathname;
  const method = req.method;

  // Skrivande anrop måste komma från hubben själv (skydd mot verktyg och andra sidor).
  if (method !== 'GET' && method !== 'HEAD') {
    const origin = req.headers.origin;
    if (origin && !HUB_ORIGINS.has(origin)) return send(res, 403, { error: 'Otillåten origin' });
  }

  try {
    // -------------------------------------------- API
    if (p === '/api/health' && method === 'GET') {
      return send(res, 200, {
        ok: true, mode: 'server', version: VERSION,
        toolOrigin: `http://${host.startsWith('localhost') ? 'localhost' : config.host}:${config.toolPort}`,
        toolApi: !!config.toolApi.enabled,
        paths: { data: path.relative(ROOT, DATA_DIR), tools: path.relative(ROOT, TOOLS_DIR) }
      });
    }

    if (p === '/api/db') {
      if (method === 'GET') {
        if (!fs.existsSync(DB_FILE)) return send(res, 200, 'null', { 'Content-Type': 'application/json' });
        return serveFile(res, DB_FILE, { 'Cache-Control': 'no-store' });
      }
      if (method === 'PUT') {
        const body = await readJson(req);
        if (!body || typeof body !== 'object' || !body.version) return send(res, 400, { error: 'Ogiltig databas' });
        await saveDb(JSON.stringify(body));
        return send(res, 200, { ok: true, saved: new Date().toISOString() });
      }
    }

    if (p === '/api/attachments' && method === 'POST') {
      const body = await readJson(req);
      const name = path.basename(String(body.name || 'fil')).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').slice(0, 160) || 'fil';
      const id = 'f-' + crypto.randomBytes(6).toString('hex');
      const dir = path.join(ATT_DIR, id);
      await fsp.mkdir(dir, { recursive: true });
      const buf = Buffer.from(String(body.data || ''), 'base64');
      await fsp.writeFile(path.join(dir, name), buf);
      return send(res, 200, { id, name, size: buf.length, url: `/files/${id}/${encodeURIComponent(name)}` });
    }

    const toolMatch = p.match(/^\/api\/tools(?:\/([^/]+))?(\/files)?$/);
    if (toolMatch) {
      const id = toolMatch[1] ? decodePath(toolMatch[1]) : null;

      if (!id && method === 'POST') {
        const body = await readJson(req);
        const files = Array.isArray(body.files) ? body.files : [];
        if (!files.length) return send(res, 400, { error: 'Inga filer skickades' });
        const entry = String(body.entry || 'index.html');
        const rels = files.map((f) => String(f.path || '').replace(/\\/g, '/').replace(/^\/+/, ''));
        if (!rels.includes(entry)) return send(res, 400, { error: `Startfilen ${entry} saknas bland filerna` });

        let toolId = isSafeId(body.id) ? body.id : slugify(body.name);
        if (fs.existsSync(path.join(TOOLS_DIR, toolId))) toolId = `${toolId}-${crypto.randomBytes(2).toString('hex')}`;
        const dir = path.join(TOOLS_DIR, toolId);

        // Validera alla sökvägar innan något skrivs.
        const targets = rels.map((r) => safeJoin(dir, r));
        if (targets.some((t) => !t || t === dir)) return send(res, 400, { error: 'Ogiltig filsökväg i verktyget' });

        await fsp.mkdir(dir, { recursive: true });
        for (let i = 0; i < files.length; i++) {
          await fsp.mkdir(path.dirname(targets[i]), { recursive: true });
          await fsp.writeFile(targets[i], Buffer.from(String(files[i].data || ''), 'base64'));
        }
        return send(res, 200, { id: toolId, entry, folder: `${path.relative(ROOT, TOOLS_DIR)}/${toolId}`, files: files.length });
      }

      if (id && !isSafeId(id)) return send(res, 400, { error: 'Ogiltigt verktygs-id' });

      if (id && toolMatch[2] && method === 'GET') {
        const dir = path.join(TOOLS_DIR, id);
        if (!fs.existsSync(dir)) return send(res, 404, { error: 'Verktygsmappen saknas' });
        return send(res, 200, { id, folder: `${path.relative(ROOT, TOOLS_DIR)}/${id}`, files: await listFiles(dir) });
      }

      if (id && method === 'DELETE') {
        const dir = path.join(TOOLS_DIR, id);
        if (fs.existsSync(dir)) await fsp.rm(dir, { recursive: true, force: true });
        return send(res, 200, { ok: true });
      }
    }

    // -------------------------------------------- datakällor / hämta uppdateringar
    if (p === '/api/sources') {
      if (method === 'GET') return send(res, 200, await sources.list());
      if (method === 'PUT') return send(res, 200, { sources: await sources.save((await readJson(req)).sources) });
    }
    if (p === '/api/sources/test' && method === 'POST') return send(res, 200, await sources.test((await readJson(req)).source));
    if (p === '/api/sync' && method === 'POST') { const b = await readJson(req); return send(res, 200, await sources.sync(b.ids)); }
    if (p === '/api/source-file' && method === 'GET') {
      const file = await sources.resolveFile(url.searchParams.get('s'), url.searchParams.get('p') || '');
      if (!file) return send(res, 404, 'Hittades inte');
      return serveFile(res, file, { 'Content-Security-Policy': "sandbox; default-src 'none'; img-src 'self'; style-src 'unsafe-inline'" });
    }

    if (p.startsWith('/api/')) return send(res, 404, { error: 'Okänt API' });

    // -------------------------------------------- filer
    if (method !== 'GET' && method !== 'HEAD') return send(res, 405, 'Metoden stöds inte');

    if (p.startsWith('/files/')) {
      const rel = decodePath(p.slice('/files/'.length));
      const file = rel && safeJoin(ATT_DIR, rel);
      if (!file) return send(res, 400, 'Ogiltig sökväg');
      return serveFile(res, file, { 'Content-Security-Policy': "sandbox; default-src 'none'; img-src 'self'; style-src 'unsafe-inline'" });
    }

    if (p === '/' || p === '/index.html') return serveFile(res, path.join(ROOT, 'index.html'));
    const rel = decodePath(p.slice(1));
    const top = rel ? rel.split('/')[0] : '';
    if (rel && STATIC_ROOTS.includes(top)) {
      const file = safeJoin(ROOT, rel);
      if (!file) return send(res, 400, 'Ogiltig sökväg');
      return serveFile(res, file);
    }
    return send(res, 404, 'Hittades inte');
  } catch (err) {
    console.error(err);
    return send(res, err.status || 500, { error: err.message || 'Serverfel' });
  }
}

// ---------------------------------------------------------------- tools
const API_COLLECTIONS = {
  activities: 'activities', drawings: 'drawings', models: 'models', issues: 'issues',
  actions: 'actions', areas: 'areas', packages: 'packages', decisions: 'decisions', meetings: 'meetings'
};

async function handleToolApi(req, res, p) {
  // Framtida PROJECT CONTROL HUB API – endast läsning.
  if (!config.toolApi.enabled) return send(res, 404, { error: 'Tool API är avstängt (config.json → toolApi.enabled)' });
  if (req.method !== 'GET') return send(res, 405, { error: 'Endast läsning stöds' });
  const parts = p.replace(/^\/api\/project\/?/, '').split('/').filter(Boolean).map(decodePath);
  const coll = API_COLLECTIONS[parts[0]];
  if (!coll) return send(res, 404, { error: 'Okänd samling', available: Object.keys(API_COLLECTIONS) });
  let db = {};
  try { db = JSON.parse(await fsp.readFile(DB_FILE, 'utf8')); } catch {}
  const items = Array.isArray(db[coll]) ? db[coll] : [];
  if (!parts[1]) return send(res, 200, items);
  const item = items.find((x) => x.id === parts[1] || x.code === parts[1]);
  if (!item) return send(res, 404, { error: 'Hittades inte' });
  if (coll === 'areas') {
    const related = {};
    for (const c of ['packages', 'activities', 'drawings', 'issues', 'actions']) {
      related[c] = (db[c] || []).filter((x) => x.areaId === item.id);
    }
    return send(res, 200, { ...item, related });
  }
  return send(res, 200, item);
}

async function handleTools(req, res) {
  const host = (req.headers.host || '').toLowerCase();
  if (!TOOL_HOSTS.has(host)) return send(res, 421, 'Okänd host');
  const url = new URL(req.url, `http://${host}`);
  const p = url.pathname;

  try {
    if (p.startsWith('/api/project')) return handleToolApi(req, res, p);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Metoden stöds inte');

    const m = p.match(/^\/tools\/([^/]+)(\/.*)?$/);
    if (!m) return send(res, 404, 'Hittades inte');
    const id = decodePath(m[1]);
    if (!isSafeId(id)) return send(res, 400, 'Ogiltigt verktygs-id');
    if (!m[2]) { res.writeHead(301, { Location: `/tools/${id}/` }); return res.end(); }

    const base = path.join(TOOLS_DIR, id);
    let rel = decodePath(m[2].slice(1));
    if (rel === null) return send(res, 400, 'Ogiltig sökväg');
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    const file = safeJoin(base, rel);
    if (!file) return send(res, 400, 'Ogiltig sökväg');
    return serveFile(res, file);
  } catch (err) {
    console.error(err);
    return send(res, 500, 'Serverfel');
  }
}

// ---------------------------------------------------------------- start
async function installExamples() {
  const marker = path.join(DATA_DIR, '.examples-installed');
  if (fs.existsSync(marker) || !fs.existsSync(EXAMPLES_DIR)) return;
  for (const e of await fsp.readdir(EXAMPLES_DIR, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const dst = path.join(TOOLS_DIR, e.name);
    if (!fs.existsSync(dst)) await copyDir(path.join(EXAMPLES_DIR, e.name), dst);
  }
  await fsp.writeFile(marker, new Date().toISOString());
}

function listen(server, port, name) {
  return new Promise((resolve, reject) => {
    server.once('error', (e) => {
      if (e.code === 'EADDRINUSE') reject(new Error(`Port ${port} (${name}) används redan. Ändra i config.json eller stäng det andra programmet.`));
      else reject(e);
    });
    server.listen(port, config.host, resolve);
  });
}

async function main() {
  await fsp.mkdir(ATT_DIR, { recursive: true });
  await fsp.mkdir(TOOLS_DIR, { recursive: true });
  await installExamples();

  await listen(http.createServer(handleHub), config.hubPort, 'hub');
  await listen(http.createServer(handleTools), config.toolPort, 'verktyg');

  const url = `http://${config.host}:${config.hubPort}/`;
  console.log('');
  console.log('  Project Control Hub ' + VERSION);
  console.log('  ─────────────────────────────────────────');
  console.log(`  App:        ${url}`);
  console.log(`  Verktyg:    http://${config.host}:${config.toolPort}/tools/<id>/`);
  console.log(`  Databas:    ${DB_FILE}`);
  console.log(`  Verktygsmapp: ${TOOLS_DIR}`);
  console.log(`  Tool API:   ${config.toolApi.enabled ? 'PÅ (endast läsning)' : 'av'}`);
  console.log(`  Skript:     ${Object.keys(config.scripts).length ? Object.keys(config.scripts).join(', ') : 'inga (se config.example.json)'}`);
  console.log('');
  console.log('  Stäng fönstret eller tryck Ctrl+C för att avsluta.');

  if (process.argv.includes('--open')) {
    const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
    exec(cmd, () => {});
  }
}

main().catch((e) => { console.error('\n  ' + e.message + '\n'); process.exit(1); });
