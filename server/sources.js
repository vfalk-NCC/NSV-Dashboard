/*
 * Datakällor för "Hämta uppdateringar".
 *
 * Källtyper:
 *   folder    – en mapp på datorn, t.ex. en SharePoint-bibliotek som OneDrive synkar.
 *               Filerna skannas (PDF, DWG, IFC, bilder, e-post) och skickas till appen.
 *   schedule  – en tidplansfil (MS Project XML eller CSV), t.ex. export från Powerproject.
 *   script    – kör ett skript som är definierat i config.json (t.ex. NSV Binder) innan
 *               mapparna läses. Skript kan ALDRIG definieras från webbläsaren – bara i config.json.
 *
 * Källorna sparas i data/sources.json. Endast filer under en registrerad mapp kan läsas.
 */
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const TYPES = ['folder', 'schedule', 'script'];
const FILE_EXT = new Set(['.pdf', '.dwg', '.dxf', '.ifc', '.ifczip', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.heic', '.eml', '.msg', '.docx', '.xlsx', '.pptx', '.txt', '.csv', '.zip']);
const MAX_FILES = 8000;
const MAX_DEPTH = 10;

function expand(p) {
  if (!p) return '';
  let s = String(p).trim().replace(/^"(.*)"$/, '$1');
  s = s.replace(/%([^%]+)%/g, (m, k) => process.env[k] ?? m);
  if (s === '~' || s.startsWith('~/') || s.startsWith('~\\')) s = path.join(os.homedir(), s.slice(1));
  return path.resolve(s);
}

function within(root, file) {
  const r = path.resolve(root), f = path.resolve(file);
  return f === r || f.startsWith(r + path.sep);
}

module.exports = function createSources({ dataDir, config }) {
  const FILE = path.join(dataDir, 'sources.json');
  const scripts = config.scripts || {};

  async function load() {
    try { const j = JSON.parse(await fsp.readFile(FILE, 'utf8')); return Array.isArray(j) ? j : []; } catch { return []; }
  }

  function clean(list) {
    if (!Array.isArray(list)) throw Object.assign(new Error('Ogiltig lista'), { status: 400 });
    return list.slice(0, 100).map((s) => {
      if (!TYPES.includes(s.type)) throw Object.assign(new Error(`Okänd källtyp: ${s.type}`), { status: 400 });
      const o = {
        id: String(s.id || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || `src-${Date.now().toString(36)}`,
        type: s.type,
        name: String(s.name || 'Källa').slice(0, 80),
        kind: String(s.kind || '').slice(0, 30),        // visningsetikett: sharepoint, binder, powerproject …
        enabled: s.enabled !== false,
        auto: !!s.auto
      };
      if (s.type === 'folder') Object.assign(o, {
        path: String(s.path || '').slice(0, 500), recursive: s.recursive !== false,
        target: ['auto', 'drawings', 'documents'].includes(s.target) ? s.target : 'auto',
        pattern: String(s.pattern || '').slice(0, 300), packageId: s.packageId || null, areaId: s.areaId || null
      });
      if (s.type === 'schedule') Object.assign(o, { path: String(s.path || '').slice(0, 500), createNew: !!s.createNew });
      if (s.type === 'script') Object.assign(o, { script: String(s.script || '') });
      return o;
    });
  }

  async function save(list) {
    const c = clean(list);
    await fsp.mkdir(dataDir, { recursive: true });
    await fsp.writeFile(FILE, JSON.stringify(c, null, 2));
    return c;
  }

  async function scanFolder(src, limit = MAX_FILES) {
    const root = expand(src.path);
    const st = await fsp.stat(root).catch(() => null);
    if (!st || !st.isDirectory()) throw new Error(`Mappen hittades inte: ${root}`);
    const files = [];
    const walk = async (dir, depth) => {
      if (files.length >= limit || depth > MAX_DEPTH) return;
      let entries = [];
      try { entries = await fsp.readdir(dir, { withFileTypes: true }); } catch { return; }
      for (const e of entries) {
        if (files.length >= limit) return;
        if (e.name.startsWith('.') || e.name.startsWith('~$') || e.name === 'Thumbs.db') continue;
        const full = path.join(dir, e.name);
        if (e.isDirectory()) { if (src.recursive) await walk(full, depth + 1); continue; }
        const ext = path.extname(e.name).toLowerCase();
        if (!FILE_EXT.has(ext)) continue;
        try {
          const s = await fsp.stat(full);
          files.push({ path: path.relative(root, full).split(path.sep).join('/'), name: e.name, ext, size: s.size, mtime: s.mtime.toISOString() });
        } catch {}
      }
    };
    await walk(root, 0);
    return { root, files, truncated: files.length >= limit };
  }

  async function readSchedule(src) {
    const file = expand(src.path);
    const st = await fsp.stat(file).catch(() => null);
    if (!st || !st.isFile()) throw new Error(`Tidplansfilen hittades inte: ${file}`);
    if (st.size > 50 * 1024 * 1024) throw new Error('Tidplansfilen är större än 50 MB');
    const ext = path.extname(file).toLowerCase();
    if (!['.xml', '.csv', '.txt'].includes(ext)) throw new Error('Tidplanen måste vara MS Project XML (.xml) eller CSV (.csv). Exportera från Powerproject.');
    let buf = await fsp.readFile(file);
    // CSV från Excel kan vara Windows-1252; försök upptäcka och konvertera enkelt
    let text = buf.toString('utf8');
    if (text.includes('�')) text = buf.toString('latin1');
    return { file, ext, mtime: st.mtime.toISOString(), size: st.size, text };
  }

  function runScript(src) {
    const def = scripts[src.script];
    if (!def || !def.command) return Promise.reject(new Error(`Skriptet "${src.script}" finns inte i config.json → scripts`));
    const timeout = Math.max(5, Math.min(3600, def.timeoutSec || 600)) * 1000;
    return new Promise((resolve, reject) => {
      const started = Date.now();
      exec(def.command, { cwd: def.cwd ? expand(def.cwd) : undefined, timeout, windowsHide: true, maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
        const log = `${stdout || ''}${stderr ? '\n' + stderr : ''}`.trim().slice(-4000);
        if (err) return reject(Object.assign(new Error(err.killed ? `Skriptet avbröts efter ${timeout / 1000} s` : `Skriptet misslyckades (kod ${err.code})`), { log }));
        resolve({ ms: Date.now() - started, log });
      });
    });
  }

  async function runOne(src, { test = false } = {}) {
    const res = { id: src.id, type: src.type, ok: true };
    try {
      if (src.type === 'folder') {
        const r = await scanFolder(src, test ? 400 : MAX_FILES);
        Object.assign(res, { root: r.root, files: test ? r.files.slice(0, 400) : r.files, count: r.files.length, truncated: r.truncated });
      } else if (src.type === 'schedule') {
        Object.assign(res, await readSchedule(src));
      } else if (src.type === 'script') {
        if (test) { const def = scripts[src.script]; if (!def) throw new Error(`Skriptet "${src.script}" finns inte i config.json`); res.command = def.command; }
        else Object.assign(res, await runScript(src));
      }
    } catch (e) { res.ok = false; res.error = e.message; if (e.log) res.log = e.log; }
    return res;
  }

  return {
    async list() { return { sources: await load(), scripts: Object.entries(scripts).map(([id, d]) => ({ id, label: d.label || id })) }; },
    save,
    async test(src) { return runOne(clean([src])[0], { test: true }); },
    /** Skript först (de fyller ofta mappar), sedan mappar och tidplaner. */
    async sync(ids) {
      const all = (await load()).filter((s) => s.enabled && (!ids || ids.includes(s.id)));
      const order = [...all.filter((s) => s.type === 'script'), ...all.filter((s) => s.type !== 'script')];
      const results = [];
      for (const s of order) results.push(await runOne(s));
      return { ts: new Date().toISOString(), results };
    },
    /** Läs en fil från en registrerad mappkälla. Returnerar absolut sökväg eller null. */
    async resolveFile(id, rel) {
      const src = (await load()).find((s) => s.id === id && (s.type === 'folder' || s.type === 'schedule'));
      if (!src || typeof rel !== 'string' || rel.includes('\0')) return null;
      if (src.type === 'schedule') return expand(src.path);
      const root = expand(src.path);
      const f = path.resolve(root, '.' + path.sep + rel);
      return within(root, f) ? f : null;
    }
  };
};
