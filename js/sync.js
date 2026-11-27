// "Hämta uppdateringar": läser in ändringar från datakällor (SharePoint via synkad mapp,
// mappar på datorn, Powerproject-tidplan, egna skript som NSV Binder) via den lokala servern.
import { store, all, get, mutate, uid, isoDate, today, latestVersion, labelOf, codeOf, emit, on, persist } from './store.js';
import { h, icon, toast, modal, confirmDialog, contextMenu, fmtDate, ago, fmtSize, norm, $ } from './ui.js';
import { app } from './app.js';

export const DEFAULT_PATTERN = '^(?<number>[A-Z0-9]+(?:[-.][A-Z0-9]+)+)(?:[ _]+(?:rev[ _.]?)?(?<rev>[A-Z]{1,2}|\\d{1,2}))?(?:[ _]+(?<title>.+))?$';

const KINDS = {
  sharepoint: { label: 'SharePoint-bibliotek', icon: 'cloud', type: 'folder', hint: 'Synka biblioteket med OneDrive ("Synkronisera" i SharePoint) och klistra in mappens sökväg.' },
  folder: { label: 'Mapp på datorn', icon: 'folder', type: 'folder', hint: 'Valfri mapp, t.ex. där NSV Binder sparar PDF:er.' },
  powerproject: { label: 'Powerproject-tidplan', icon: 'gantt', type: 'schedule', hint: 'Exportera tidplanen som MS Project XML (eller CSV) till en fast plats. Appen läser in den när filen ändras.' },
  script: { label: 'Skript (t.ex. NSV Binder)', icon: 'bolt', type: 'script', hint: 'Kör ett skript som är definierat i config.json innan mapparna läses.' }
};

export const sync = { sources: [], scripts: [], running: false, last: null };

function state() {
  store.db.sync = store.db.sync || { interval: 15, lastSync: null, state: {} };
  store.db.sync.state = store.db.sync.state || {};
  return store.db.sync;
}

// ------------------------------------------------------------------ server-API
async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Fel ${r.status}`);
  return j;
}
export async function loadSources() {
  if (store.mode !== 'server') return;
  try { const j = await api('api/sources'); sync.sources = j.sources; sync.scripts = j.scripts; } catch (e) { console.warn(e); }
  emit('sync', sync);
}
async function saveSources() {
  const j = await api('api/sources', { method: 'PUT', body: JSON.stringify({ sources: sync.sources }) });
  sync.sources = j.sources;
  emit('sync', sync);
}

// ------------------------------------------------------------------ hämta
export async function runSync({ ids, auto = false } = {}) {
  if (store.mode !== 'server') {
    toast('Hämta uppdateringar kräver den lokala servern (start.bat).', { tone: 'warn', iconName: 'server' });
    return;
  }
  if (sync.running) return;
  if (!sync.sources.length) await loadSources();
  if (!sync.sources.filter((s) => s.enabled).length) {
    if (!auto) manageSources();
    return;
  }
  // Utan uppkoppling: hoppa över skript (de hämtar ofta från nätet), läs mappar ändå.
  let run = ids || sync.sources.filter((s) => s.enabled && (!auto || s.auto)).map((s) => s.id);
  if (!navigator.onLine) run = run.filter((id) => sync.sources.find((s) => s.id === id)?.type !== 'script');
  if (!run.length) return;

  sync.running = true; emit('sync', sync);
  try {
    const res = await api('api/sync', { method: 'POST', body: JSON.stringify({ ids: run }) });
    const report = apply(res);
    sync.last = report;
    const n = report.changes.filter((c) => c.kind !== 'info').length;
    const errs = report.results.filter((r) => !r.ok).length;
    if (n || errs || !auto) {
      toast(n ? `${n} ${n === 1 ? 'uppdatering' : 'uppdateringar'} inlästa${errs ? ` · ${errs} källa med fel` : ''}` : errs ? `${errs} källa kunde inte läsas` : 'Allt är redan uppdaterat',
        { tone: errs ? 'warn' : n ? 'ok' : 'info', iconName: 'refresh', timeout: 6000, action: { label: 'Visa', fn: () => showReport(report) } });
    }
  } catch (e) {
    toast(`Kunde inte hämta uppdateringar: ${e.message}`, { tone: 'bad' });
  } finally {
    sync.running = false; emit('sync', sync);
  }
}

/** Tolka serverns resultat och lägg in ändringarna i databasen (en ångra-bar ändring). */
function apply(res) {
  const st = state();
  const changes = [];
  const add = (kind, text, ref, src) => changes.push({ kind, text, ref, src });
  const ops = [];

  for (const r of res.results) {
    const src = sync.sources.find((s) => s.id === r.id);
    if (!src) continue;
    const ss = st.state[src.id] || (st.state[src.id] = { seen: {} });
    ss.lastSync = res.ts; ss.ok = r.ok; ss.error = r.error || null; ss.log = r.log || null;
    if (!r.ok) { add('error', `${src.name}: ${r.error}`, null, src); continue; }
    if (src.type === 'script') { add('info', `${src.name}: kördes klart på ${Math.round((r.ms || 0) / 1000)} s`, null, src); continue; }
    if (src.type === 'schedule') { ops.push(() => applySchedule(src, r, ss, add)); continue; }
    if (src.type === 'folder') ops.push(() => applyFolder(src, r, ss, add));
  }
  const n = () => changes.filter((c) => !['info', 'error'].includes(c.kind)).length;
  mutate('Hämtade uppdateringar', () => { ops.forEach((f) => f()); st.lastSync = res.ts; }, { kind: 'sync', silent: true });
  if (n()) store.db.history.unshift({ id: uid('h'), ts: new Date().toISOString(), text: `Hämtade uppdateringar: ${summary(changes)}`, ref: null, kind: 'sync' });
  persist();
  return { ts: res.ts, changes, results: res.results };
}

function summary(changes) {
  const c = (k) => changes.filter((x) => x.kind === k).length;
  return [[c('new-drawing'), 'ny ritning', 'nya ritningar'], [c('rev'), 'ny revision', 'nya revisioner'], [c('model'), 'ny modellversion', 'nya modellversioner'], [c('doc'), 'nytt dokument', 'nya dokument'], [c('update'), 'uppdaterad fil', 'uppdaterade filer'], [c('activity'), 'aktivitet ändrad', 'aktiviteter ändrade'], [c('new-activity'), 'ny aktivitet', 'nya aktiviteter']]
    .filter(([n]) => n).map(([n, one, many]) => `${n} ${n === 1 ? one : many}`).join(', ') || 'inga ändringar';
}

// ------------------------------------------------------------------ mappar
function parseDrawing(name, pattern) {
  const base = name.replace(/\.[^.]+$/, '');
  let re;
  try { re = new RegExp(pattern || DEFAULT_PATTERN, 'i'); } catch { re = new RegExp(DEFAULT_PATTERN, 'i'); }
  const m = base.match(re);
  if (!m?.groups?.number) return null;
  return { number: m.groups.number.toUpperCase(), rev: (m.groups.rev || '').toUpperCase(), title: (m.groups.title || '').replace(/[_]+/g, ' ').trim() };
}
const kindOfExt = (ext) => ({ '.pdf': 'pdf', '.dwg': 'cad', '.dxf': 'cad', '.ifc': 'ifc', '.ifczip': 'ifc', '.eml': 'email', '.msg': 'email', '.png': 'photo', '.jpg': 'photo', '.jpeg': 'photo', '.gif': 'photo', '.webp': 'photo', '.heic': 'photo' }[ext] || 'file');

function guessPackage(text) {
  const t = text.toUpperCase();
  return all('package').find((p) => t.startsWith(p.code.toUpperCase() + '-') || t.startsWith(p.code.toUpperCase() + '.') || t.startsWith(p.code.toUpperCase() + '_'));
}

function applyFolder(src, r, ss, add) {
  const db = store.db;
  const seen = ss.seen || (ss.seen = {});
  const now = new Set();
  const fileRef = (f) => ({ store: 'source', sourceId: src.id, path: f.path, name: f.name, size: f.size });
  const link = (a, b) => { if (!db.relations.some((x) => (x.a.id === a.id && x.b.id === b.id) || (x.a.id === b.id && x.b.id === a.id))) db.relations.push({ id: uid('rel'), a, b, ts: new Date().toISOString() }); };

  for (const f of r.files) {
    now.add(f.path);
    const prev = seen[f.path];
    if (prev && prev.mtime === f.mtime && prev.size === f.size) continue;
    seen[f.path] = { mtime: f.mtime, size: f.size };
    const kind = kindOfExt(f.ext);
    const date = f.mtime.slice(0, 10);

    // Ritningar
    if ((kind === 'pdf' || kind === 'cad') && src.target !== 'documents') {
      const d = parseDrawing(f.name, src.pattern);
      if (d) {
        let dr = db.drawings.find((x) => x.number.toUpperCase() === d.number);
        if (dr) {
          const ref = { t: 'drawing', id: dr.id };
          if (d.rev && d.rev !== dr.rev && !(dr.revisions || []).some((x) => x.rev === d.rev)) {
            dr.revisions = [...(dr.revisions || []), { rev: dr.rev, date: dr.date, file: dr.file || null }];
            add('rev', `${dr.number} rev ${dr.rev || '–'} → ${d.rev}`, ref, src);
            Object.assign(dr, { rev: d.rev, date, file: fileRef(f), modified: new Date().toISOString() });
            db.history.unshift({ id: uid('h'), ts: new Date().toISOString(), text: `Ny revision ${dr.number} rev ${d.rev} från ${src.name}`, ref, kind: 'status' });
          } else if (prev || !dr.file) {
            Object.assign(dr, { file: fileRef(f), date });
            if (prev) add('update', `${dr.number}: ny fil (${f.name})`, ref, src);
          }
        } else {
          const pk = (src.packageId && db.packages.find((p) => p.id === src.packageId)) || guessPackage(d.number);
          dr = { id: uid('dr'), number: d.number, name: d.title || d.number, rev: d.rev || '–', discipline: '', areaId: src.areaId || pk?.areaId || null, status: 'prelim', date, source: '', file: fileRef(f), created: new Date().toISOString() };
          db.drawings.unshift(dr);
          if (pk) link({ t: 'drawing', id: dr.id }, { t: 'package', id: pk.id });
          add('new-drawing', `${dr.number} ${dr.name !== dr.number ? dr.name : ''} rev ${dr.rev}`, { t: 'drawing', id: dr.id }, src);
        }
        continue;
      }
    }

    // Modeller
    if (kind === 'ifc') {
      const base = norm(f.name.replace(/\.[^.]+$/, '').replace(/[_-]?v?\d+$/i, ''));
      let m = db.models.find((x) => base.includes(norm(x.name)) || norm(x.name).includes(base));
      if (!m) { m = { id: uid('md'), name: f.name.replace(/\.[^.]+$/, '').replace(/[_-]?v?\d+$/i, ''), discipline: 'Övrigt', areaId: src.areaId || null, versions: [], created: new Date().toISOString() }; db.models.unshift(m); }
      const v = (latestVersion(m)?.v || 0) + 1;
      m.versions.push({ v, date, author: src.name, note: f.name, schema: '', file: fileRef(f), size: f.size });
      add('model', `${m.name} v${v}`, { t: 'model', id: m.id }, src);
      continue;
    }

    // Övriga dokument
    const key = `${src.id}:${f.path}`;
    let doc = db.documents.find((x) => x.sourceKey === key);
    if (doc) { Object.assign(doc, { file: fileRef(f), size: f.size, date }); add('update', `${f.name} uppdaterad`, { t: 'document', id: doc.id }, src); }
    else {
      const pk = (src.packageId && db.packages.find((p) => p.id === src.packageId)) || guessPackage(f.name);
      doc = { id: uid('do'), kind, name: f.name, subject: f.name.replace(/\.[^.]+$/, ''), date, size: f.size, file: fileRef(f), sourceKey: key, packageId: pk?.id || null, created: new Date().toISOString() };
      db.documents.unshift(doc);
      add('doc', `${f.name}${pk ? ` → ${pk.code}` : ''}`, { t: 'document', id: doc.id }, src);
    }
  }
  const removed = Object.keys(seen).filter((p) => !now.has(p));
  removed.forEach((p) => delete seen[p]);
  if (removed.length && !r.truncated) add('info', `${src.name}: ${removed.length} filer finns inte längre i mappen (inget togs bort i appen)`, null, src);
  if (r.truncated) add('info', `${src.name}: mappen har fler än ${r.files.length} filer – resten lästes inte`, null, src);
}

// ------------------------------------------------------------------ tidplan
function parseScheduleText(text, ext) {
  if (ext === '.xml' || /^\s*<\?xml|<Project/i.test(text.slice(0, 500))) {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('XML-filen kunde inte tolkas');
    const val = (t, tag) => t.getElementsByTagName(tag)[0]?.textContent?.trim() || '';
    return [...doc.getElementsByTagName('Task')].map((t) => ({
      wbs: val(t, 'WBS') || val(t, 'OutlineNumber'), name: val(t, 'Name'),
      start: val(t, 'Start').slice(0, 10), end: val(t, 'Finish').slice(0, 10),
      progress: Math.round(+val(t, 'PercentComplete') || 0),
      summary: val(t, 'Summary') === '1', milestone: val(t, 'Milestone') === '1'
    })).filter((t) => t.name && t.start);
  }
  // CSV (; , eller tab)
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const delim = [';', '\t', ','].sort((a, b) => lines[0].split(b).length - lines[0].split(a).length)[0];
  const split = (l) => { const out = []; let cur = '', q = false; for (const c of l) { if (c === '"') q = !q; else if (c === delim && !q) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out.map((x) => x.trim()); };
  const head = split(lines[0]).map((x) => norm(x));
  const col = (...names) => head.findIndex((x) => names.some((n) => x === n || x.includes(n)));
  const ci = { code: col('kod', 'code', 'wbs', 'id'), name: col('namn', 'name', 'aktivitet', 'activity', 'beskrivning', 'task'), start: col('start'), end: col('slut', 'finish', 'end'), pr: col('framdrift', 'progress', '%', 'complete', 'klart') };
  const date = (s) => {
    if (!s) return '';
    let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/); if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
    m = s.match(/(\d{1,2})[./](\d{1,2})[./](\d{2,4})/); if (m) return `${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    return '';
  };
  return lines.slice(1).map(split).map((c) => {
    const raw = ci.pr >= 0 ? c[ci.pr] : '';
    let p = parseFloat(String(raw).replace(',', '.').replace('%', '')) || 0;
    if (!raw.includes('%') && p > 0 && p <= 1 && /[.,]/.test(raw)) p *= 100;
    return { wbs: ci.code >= 0 ? c[ci.code] : '', name: ci.name >= 0 ? c[ci.name] : '', start: date(c[ci.start]), end: date(c[ci.end]), progress: Math.round(p), summary: false, milestone: false };
  }).filter((t) => t.name && t.start);
}

function applySchedule(src, r, ss, add) {
  if (ss.mtime === r.mtime && ss.size === r.size) { add('info', `${src.name}: tidplanen är oförändrad`, null, src); return; }
  ss.mtime = r.mtime; ss.size = r.size;
  let tasks;
  try { tasks = parseScheduleText(r.text, r.ext); } catch (e) { add('error', `${src.name}: ${e.message}`, null, src); return; }
  const db = store.db;
  let matched = 0, unmatched = 0;
  for (const t of tasks.filter((x) => !x.summary)) {
    const tok = (t.name.match(/^([A-Z0-9]+(?:\.[A-Z0-9]+)+)\s+/i) || [])[1];
    const codes = [t.wbs, tok].filter(Boolean).map((x) => x.toUpperCase());
    let a = db.activities.find((x) => codes.includes(String(x.code).toUpperCase())) || db.activities.find((x) => norm(x.name) === norm(tok ? t.name.slice(tok.length).trim() : t.name));
    const end = t.end || t.start;
    if (a) {
      matched++;
      const diff = [];
      if (t.start !== a.start) diff.push(`start ${fmtDate(a.start)}→${fmtDate(t.start)}`);
      if (end !== a.end) diff.push(`slut ${fmtDate(a.end)}→${fmtDate(end)}`);
      if (t.progress !== a.progress) diff.push(`${a.progress}%→${t.progress}%`);
      if (diff.length) {
        Object.assign(a, { start: t.start, end, progress: Math.max(0, Math.min(100, t.progress)), milestone: t.milestone || a.milestone, modified: new Date().toISOString() });
        add('activity', `${a.code} ${a.name}: ${diff.join(', ')}`, { t: 'activity', id: a.id }, src);
      }
    } else if (src.createNew) {
      // Koden i namnet (t.ex. "F12.06 Återfyllning") väger tyngst; WBS-siffror som "1.6" säger inget om paketet.
      const code = (tok || t.wbs || '').toUpperCase();
      const pk = guessPackage(code) || codes.map(guessPackage).find(Boolean);
      if (!pk) { unmatched++; continue; }
      a = { id: uid('ac'), code: code || `${pk.code}.${String(db.activities.filter((x) => x.packageId === pk.id).length + 1).padStart(2, '0')}`, name: tok ? t.name.slice(tok.length).trim() : t.name, packageId: pk.id, areaId: pk.areaId, discipline: pk.discipline, contractor: pk.contractor, responsible: pk.responsible, start: t.start, end, progress: t.progress, milestone: t.milestone, created: new Date().toISOString() };
      db.activities.push(a);
      add('new-activity', `${a.code} ${a.name}`, { t: 'activity', id: a.id }, src);
    } else unmatched++;
  }
  add('info', `${src.name}: ${tasks.length} aktiviteter lästa, ${matched} matchade${unmatched ? `, ${unmatched} utan motsvarighet` : ''}`, null, src);
}

// ------------------------------------------------------------------ rapport
export function showReport(report = sync.last) {
  if (!report) { toast('Ingen hämtning har gjorts ännu'); return; }
  const groups = new Map();
  for (const c of report.changes) { const k = c.src?.id || '-'; if (!groups.has(k)) groups.set(k, { src: c.src, list: [] }); groups.get(k).list.push(c); }
  const ICON = { 'new-drawing': 'drawing', rev: 'drawing', model: 'cube', doc: 'paperclip', update: 'refresh', activity: 'gantt', 'new-activity': 'gantt', error: 'alert', info: 'info' };
  const m = modal({
    title: 'Uppdateringar', subtitle: `${fmtDate(report.ts.slice(0, 10))} ${report.ts.slice(11, 16)} · ${summary(report.changes)}`, width: 640,
    body: h('div', { class: 'sync-report' }, [...groups.values()].map(({ src, list }) => h('section', { class: 'sr-sec' },
      h('div', { class: 'sr-head' }, icon(KINDS[src?.kind]?.icon || 'folder', 15), h('b', src?.name || 'Källa'), h('em', list.filter((c) => !['info'].includes(c.kind)).length)),
      list.slice(0, 200).map((c) => h('div', { class: `sr-row k-${c.kind} ${c.ref ? 'clickable' : ''}`, onclick: () => { if (c.ref && get(c.ref)) { m.close(); app.select(c.ref, { reveal: true }); } } },
        icon(ICON[c.kind] || 'dots', 14), h('span', c.text), c.kind === 'new-drawing' || c.kind === 'doc' || c.kind === 'new-activity' ? h('span', { class: 'badge tone-ok' }, 'Ny') : c.kind === 'rev' ? h('span', { class: 'badge tone-accent' }, 'Revision') : null)),
      list.length > 200 && h('p', { class: 'muted small' }, `+ ${list.length - 200} till`),
      (() => { const r = report.results.find((x) => x.id === src?.id); return r?.log ? h('details', { class: 'file-list' }, h('summary', 'Skriptets utskrift'), h('pre', { class: 'sr-log' }, r.log)) : null; })()))),
    actions: [{ label: 'Hantera källor', ghost: true, icon: 'server', onClick: () => { setTimeout(manageSources, 50); } }, { spacer: true }, { label: 'Stäng', primary: true }]
  });
}

// ------------------------------------------------------------------ källhantering
export async function manageSources() {
  if (store.mode !== 'server') {
    modal({ title: 'Datakällor', width: 520, body: h('div', { class: 'banner' }, icon('info', 16), h('div', h('b', 'Kräver den lokala servern. '), 'Starta appen med start.bat för att koppla mappar, SharePoint, Powerproject och skript.')), actions: [{ spacer: true }, { label: 'OK', primary: true }] });
    return;
  }
  await loadSources();
  const st = state();
  const body = h('div', { class: 'sources' });
  const render = () => {
    body.replaceChildren(
      sync.sources.length ? h('div', { class: 'src-list' }, sync.sources.map((s) => {
        const ss = st.state[s.id] || {};
        const k = KINDS[s.kind] || KINDS[s.type === 'schedule' ? 'powerproject' : s.type === 'script' ? 'script' : 'folder'];
        return h('div', { class: `src-row ${s.enabled ? '' : 'off'}` },
          h('span', { class: 'src-ic' }, icon(k.icon, 16)),
          h('div', { class: 'grow' },
            h('b', s.name),
            h('small', s.type === 'script' ? `Skript: ${sync.scripts.find((x) => x.id === s.script)?.label || s.script}` : s.path),
            h('small', { class: ss.error ? 'tone-text-bad' : 'muted' }, ss.error ? `Fel: ${ss.error}` : ss.lastSync ? `Senast hämtad ${ago(ss.lastSync)}` : 'Inte hämtad än')),
          h('label', { class: 'switch', title: 'Hämta automatiskt' }, h('input', { type: 'checkbox', checked: s.auto, onchange: async (e) => { s.auto = e.target.checked; await saveSources(); } }), h('i'), h('span', 'Auto')),
          h('button', { class: 'btn sm ghost', title: 'Hämta från den här källan nu', onclick: () => runSync({ ids: [s.id] }) }, icon('refresh', 13)),
          h('button', { class: 'iconbtn sm', title: 'Fler val', onclick: (e) => { const r = e.currentTarget.getBoundingClientRect(); contextMenu(r.left - 180, r.bottom + 4, [
            { label: 'Redigera…', icon: 'note', action: () => editSource(s, render) },
            { label: s.enabled ? 'Pausa källan' : 'Aktivera källan', icon: s.enabled ? 'minus' : 'check', action: async () => { s.enabled = !s.enabled; await saveSources(); render(); } },
            { label: 'Glöm vad som lästs (läs om allt)', icon: 'history', action: () => { delete st.state[s.id]; persist(); render(); toast('Nästa hämtning läser in hela källan igen'); } },
            { divider: true },
            { label: 'Ta bort källa…', icon: 'trash', danger: true, action: async () => { if (await confirmDialog({ title: `Ta bort ${s.name}?`, text: 'Källan kopplas bort. Information som redan lästs in ligger kvar, och inga filer på datorn påverkas.', okLabel: 'Ta bort', danger: true })) { sync.sources = sync.sources.filter((x) => x !== s); await saveSources(); render(); } } }
          ]); } }, icon('dots', 15)));
      })) : h('div', { class: 'empty' }, h('b', 'Inga källor kopplade än'), h('p', 'Lägg till SharePoint, en mapp, en Powerproject-tidplan eller ett skript nedan.')),
      h('div', { class: 'src-add' }, h('div', { class: 'fm-head' }, 'Lägg till källa'),
        h('div', { class: 'add-options four' }, Object.entries(KINDS).map(([k, v]) => h('button', { class: 'add-opt', onclick: () => editSource({ kind: k, type: v.type, name: v.label, enabled: true, auto: true, recursive: true, target: 'auto' }, render, true) }, icon(v.icon, 20), h('b', v.label), h('small', v.hint))))),
      h('div', { class: 'set-row' }, h('div', h('b', 'Automatisk hämtning'), h('small', 'Källor markerade med Auto hämtas när appen startar, när datorn får uppkoppling igen och med jämna mellanrum. Skript körs bara när datorn är uppkopplad.')),
        h('select', { class: 'input', style: { width: '160px' }, onchange: (e) => { st.interval = +e.target.value; persist(); scheduleAuto(); } },
          [[0, 'Bara vid start'], [5, 'Var 5:e minut'], [15, 'Var 15:e minut'], [30, 'Var 30:e minut'], [60, 'Varje timme']].map(([v, l]) => h('option', { value: v, selected: (st.interval ?? 15) === v }, l)))));
  };
  render();
  const unsub = on('sync', () => { if (body.isConnected) render(); });
  modal({ title: 'Datakällor', subtitle: 'Varifrån "Hämta uppdateringar" läser in nytt', width: 720, body, onClose: unsub,
    actions: [{ spacer: true }, { label: 'Stäng', ghost: true }, { label: 'Hämta nu', primary: true, icon: 'refresh', onClick: () => { runSync(); } }] });
}

function editSource(s, done, isNew = false) {
  const kind = KINDS[s.kind] || KINDS.folder;
  const f = {};
  const field = (key, label, el, full, help) => { f[key] = el; return h('label', { class: `field ${full ? 'full' : ''}` }, h('span', label), el, help && h('small', { class: 'muted' }, help)); };
  const preview = h('div', { class: 'src-preview' });
  const pk = all('package');
  const fields = [field('name', 'Namn', h('input', { class: 'input', value: s.name || '' }), true)];
  if (s.type === 'folder' || s.type === 'schedule') {
    fields.push(field('path', s.type === 'schedule' ? 'Sökväg till tidplansfilen' : 'Sökväg till mappen', h('input', { class: 'input mono', value: s.path || '', placeholder: s.type === 'schedule' ? 'C:\\NSV\\Tidplan\\NSV-tidplan.xml' : s.kind === 'sharepoint' ? 'C:\\Users\\namn\\NCC\\NSV - Dokument\\Ritningar' : 'C:\\NSV\\Binder\\PDF' }), true,
      'Tips: håll Shift och högerklicka på mappen/filen i Utforskaren → "Kopiera som sökväg", och klistra in här.'));
  }
  if (s.type === 'folder') {
    fields.push(
      field('target', 'Läs in som', h('select', { class: 'input' }, [['auto', 'Automatiskt (ritningar, modeller, dokument)'], ['drawings', 'Ritningar'], ['documents', 'Endast dokument']].map(([v, l]) => h('option', { value: v, selected: s.target === v }, l)))),
      field('packageId', 'Koppla till arbetspaket', h('select', { class: 'input' }, h('option', { value: '' }, 'Gissa från filnamn'), pk.map((p) => h('option', { value: p.id, selected: s.packageId === p.id }, `${p.code} ${p.name}`)))),
      field('recursive', 'Undermappar', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ta med undermappar'), h('option', { value: '0', selected: s.recursive === false }, 'Bara översta mappen'))),
      field('auto', 'Automatisk hämtning', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ja'), h('option', { value: '0', selected: !s.auto }, 'Nej, bara manuellt'))),
      field('pattern', 'Mönster för ritningsnummer (avancerat)', h('input', { class: 'input mono', value: s.pattern || '', placeholder: 'Standard: NUMMER_REV_Titel, t.ex. F12-123_C_Grundplatta.pdf' }), true,
        'Lämna tomt för standard. Reguljärt uttryck med grupperna number, rev och title.'));
  }
  if (s.type === 'schedule') {
    fields.push(
      field('createNew', 'Aktiviteter som saknas', h('select', { class: 'input' }, h('option', { value: '0' }, 'Uppdatera bara befintliga'), h('option', { value: '1', selected: s.createNew }, 'Skapa nya (kod börjar med paketkod, t.ex. F12.06)'))),
      field('auto', 'Automatisk hämtning', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ja, när filen ändras'), h('option', { value: '0', selected: !s.auto }, 'Nej, bara manuellt'))));
    fields.push(h('p', { class: 'muted small full' }, 'Aktiviteter matchas på kod (WBS eller kod först i namnet, t.ex. "F12.03 Gjutning") och annars på namn. Start, slut och framdrift uppdateras.'));
  }
  if (s.type === 'script') {
    if (!sync.scripts.length) fields.push(h('div', { class: 'banner full' }, icon('info', 16), h('div', h('b', 'Inga skript är definierade. '), 'Av säkerhetsskäl kan skript bara läggas till i filen ', h('code', 'config.json'), ' bredvid start.bat. Kopiera ', h('code', 'config.example.json'), ' till config.json, ändra sökvägen till ditt skript och starta om appen.')));
    else fields.push(field('script', 'Skript', h('select', { class: 'input' }, sync.scripts.map((x) => h('option', { value: x.id, selected: s.script === x.id }, x.label)))),
      field('auto', 'Automatisk körning', h('select', { class: 'input' }, h('option', { value: '1' }, 'Ja, när datorn är uppkopplad'), h('option', { value: '0', selected: !s.auto }, 'Nej, bara manuellt'))),
      h('p', { class: 'muted small full' }, 'Skript körs före mapparna. Lägg till mappen som skriptet sparar i som en egen källa, så läses resultatet in direkt efteråt.'));
  }
  const collect = () => {
    const o = { ...s, name: f.name.value.trim() || kind.label };
    if (f.path) o.path = f.path.value.trim().replace(/^"(.*)"$/, '$1');
    if (f.target) o.target = f.target.value;
    if (f.packageId) o.packageId = f.packageId.value || null;
    if (f.recursive) o.recursive = f.recursive.value === '1';
    if (f.auto) o.auto = f.auto.value === '1';
    if (f.pattern) o.pattern = f.pattern.value.trim();
    if (f.createNew) o.createNew = f.createNew.value === '1';
    if (f.script) o.script = f.script.value;
    return o;
  };
  const test = async () => {
    preview.replaceChildren(h('div', { class: 'skeleton' }, h('i'), h('i')));
    try {
      const o = collect();
      const r = await api('api/sources/test', { method: 'POST', body: JSON.stringify({ source: o }) });
      if (!r.ok) { preview.replaceChildren(h('div', { class: 'val-row err' }, icon('alert', 15), r.error)); return; }
      if (o.type === 'folder') {
        const sample = r.files.slice(0, 12).map((x) => {
          const d = (kindOfExt(x.ext) === 'pdf' || kindOfExt(x.ext) === 'cad') && o.target !== 'documents' ? parseDrawing(x.name, o.pattern) : null;
          return h('li', h('code', x.path), h('small', d ? `ritning ${d.number}${d.rev ? ' rev ' + d.rev : ''}` : kindOfExt(x.ext) === 'ifc' ? 'modellversion' : 'dokument'));
        });
        preview.replaceChildren(h('div', { class: 'val-row' }, icon('checkCircle', 15), `${r.count}${r.truncated ? '+' : ''} filer hittades i ${r.root}`), h('ul', { class: 'src-sample' }, sample));
      } else if (o.type === 'schedule') {
        const tasks = parseScheduleText(r.text, r.ext);
        preview.replaceChildren(h('div', { class: 'val-row' }, icon('checkCircle', 15), `${tasks.length} aktiviteter i ${r.file} (ändrad ${ago(r.mtime)})`), h('ul', { class: 'src-sample' }, tasks.slice(0, 8).map((t) => h('li', h('code', t.wbs || '–'), h('span', t.name), h('small', `${t.start} → ${t.end} · ${t.progress}%`)))));
      } else preview.replaceChildren(h('div', { class: 'val-row' }, icon('checkCircle', 15), 'Skriptet finns: ', h('code', r.command)));
    } catch (e) { preview.replaceChildren(h('div', { class: 'val-row err' }, icon('alert', 15), e.message)); }
  };
  modal({
    title: isNew ? `Lägg till: ${kind.label}` : `Redigera ${s.name}`, subtitle: kind.hint, width: 640,
    body: h('div', h('div', { class: 'form-grid' }, fields), preview),
    actions: [{ label: 'Testa', icon: 'eye', onClick: () => { test(); return false; } }, { spacer: true }, { label: 'Avbryt', ghost: true }, { label: isNew ? 'Lägg till' : 'Spara', primary: true, onClick: async () => {
      const o = collect();
      if ((o.type === 'folder' || o.type === 'schedule') && !o.path) { f.path.classList.add('invalid'); f.path.focus(); return false; }
      if (o.type === 'script' && !o.script) return false;
      if (isNew) { o.id = `src-${Date.now().toString(36)}`; sync.sources.push(o); } else Object.assign(s, o);
      try { await saveSources(); } catch (e) { toast(e.message, { tone: 'bad' }); return false; }
      toast(`${o.name} ${isNew ? 'tillagd' : 'sparad'}`, { tone: 'ok', action: { label: 'Hämta nu', fn: () => runSync({ ids: [o.id] }) } });
      done?.();
    } }]
  });
}

// ------------------------------------------------------------------ automatik
let timer = null;
export function scheduleAuto() {
  clearInterval(timer);
  if (store.mode !== 'server') return;
  const min = state().interval ?? 15;
  if (min > 0) timer = setInterval(() => runSync({ auto: true }), min * 60 * 1000);
}
export async function initSync() {
  if (store.mode !== 'server') return;
  await loadSources();
  scheduleAuto();
  addEventListener('online', () => { toast('Uppkopplad igen – hämtar uppdateringar', { iconName: 'refresh' }); runSync({ auto: true }); });
  if (sync.sources.some((s) => s.enabled && s.auto)) setTimeout(() => runSync({ auto: true }), 2500);
}

/** Knappen i toppraden. */
export function syncButton() {
  const btn = h('button', { class: 'syncbtn', title: 'Hämta uppdateringar från SharePoint, mappar, Powerproject och skript' });
  const caret = h('button', { class: 'syncbtn-caret', title: 'Datakällor och senaste hämtning' }, icon('chevD', 13));
  const paint = () => {
    const st = store.db?.sync;
    const n = sync.sources.filter((s) => s.enabled).length;
    btn.classList.toggle('running', sync.running);
    btn.replaceChildren(icon('refresh', 15, 'sync-ic'), h('span', { class: 'sync-label' }, sync.running ? 'Hämtar…' : 'Hämta uppdateringar'),
      h('i', { class: `sync-dot ${!navigator.onLine ? 'offline' : Object.values(st?.state || {}).some((x) => x.error) ? 'err' : n ? 'ok' : ''}` }));
    btn.title = `Hämta uppdateringar (U)\n${n ? `${n} källor` : 'Inga källor kopplade än'}${st?.lastSync ? ` · senast ${ago(st.lastSync)}` : ''}${navigator.onLine ? '' : '\nIngen uppkoppling – skript hoppas över'}`;
  };
  btn.onclick = () => runSync();
  caret.onclick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    contextMenu(r.right - 240, r.bottom + 6, [
      { header: store.db?.sync?.lastSync ? `Senast hämtad ${ago(store.db.sync.lastSync)}` : 'Ingen hämtning än' },
      { label: 'Hämta uppdateringar', icon: 'refresh', kbd: 'U', action: () => runSync() },
      { label: 'Visa senaste resultat', icon: 'eye', disabled: !sync.last, action: () => showReport() },
      { label: 'Datakällor…', icon: 'server', action: () => manageSources() }
    ]);
  };
  on('sync', paint); on('change', paint);
  addEventListener('online', paint); addEventListener('offline', paint);
  paint();
  return h('div', { class: 'syncgroup' }, btn, caret);
}
