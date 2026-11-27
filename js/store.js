// Datalager: entitetstyper, relationer, ändringar med ångra, och lagring
// mot den lokala servern (data/db.json) eller webbläsaren (demoläge).
import { createSeed } from './seed.js';

export const TYPES = {
  area:     { coll: 'areas',      label: 'Område',      plural: 'Områden',     icon: 'map' },
  package:  { coll: 'packages',   label: 'Arbetspaket', plural: 'Arbetspaket', icon: 'box' },
  activity: { coll: 'activities', label: 'Aktivitet',   plural: 'Aktiviteter', icon: 'calendar' },
  drawing:  { coll: 'drawings',   label: 'Ritning',     plural: 'Ritningar',   icon: 'drawing' },
  model:    { coll: 'models',     label: 'Modell',      plural: 'Modeller',    icon: 'cube' },
  issue:    { coll: 'issues',     label: 'Ärende',      plural: 'Ärenden',     icon: 'alert' },
  action:   { coll: 'actions',    label: 'Åtgärd',      plural: 'Åtgärder',    icon: 'check' },
  decision: { coll: 'decisions',  label: 'Beslut',      plural: 'Beslut',      icon: 'gavel' },
  meeting:  { coll: 'meetings',   label: 'Möte',        plural: 'Möten',       icon: 'users' },
  document: { coll: 'documents',  label: 'Dokument',    plural: 'Dokument',    icon: 'paperclip' },
  tool:     { coll: 'tools',      label: 'Verktyg',     plural: 'Verktyg',     icon: 'tool' }
};

export const STATUS = {
  // arbetspaket
  planned: { label: 'Planerad', tone: 'neutral' },
  active: { label: 'Pågår', tone: 'info' },
  risk: { label: 'Risk', tone: 'warn' },
  done: { label: 'Klar', tone: 'ok' },
  late: { label: 'Försenad', tone: 'bad' },
  // ritningar
  prelim: { label: 'Preliminär', tone: 'neutral' },
  review: { label: 'Granskning', tone: 'warn' },
  approved: { label: 'Godkänd', tone: 'ok' },
  construction: { label: 'Bygghandling', tone: 'accent' },
  // ärenden
  open: { label: 'Öppen', tone: 'info' },
  inprogress: { label: 'Under arbete', tone: 'warn' },
  resolved: { label: 'Löst', tone: 'ok' },
  closed: { label: 'Stängd', tone: 'neutral' },
  // åtgärder
  doing: { label: 'Pågår', tone: 'warn' },
  // beslut
  proposed: { label: 'Förslag', tone: 'warn' },
  decided: { label: 'Beslutat', tone: 'ok' }
};

export const STATUS_SETS = {
  package: ['planned', 'active', 'risk', 'done'],
  activity: ['planned', 'active', 'late', 'done'],
  drawing: ['prelim', 'review', 'approved', 'construction'],
  issue: ['open', 'inprogress', 'resolved', 'closed'],
  action: ['open', 'doing', 'done'],
  decision: ['proposed', 'decided']
};
export const ACTION_STATUS_LABEL = { open: 'Öppen', doing: 'Pågår', done: 'Klar' };

export const PRIORITY = {
  high: { label: 'Hög', tone: 'bad' },
  medium: { label: 'Medel', tone: 'warn' },
  low: { label: 'Låg', tone: 'neutral' }
};

export const TOOL_CATEGORIES = ['Planering', 'VDC', 'Produktion', 'Kalkyl', 'Visualisering', 'Dokument', 'Experiment', 'Övrigt'];

// ------------------------------------------------------------------ state
export const store = {
  db: null,
  mode: 'local',          // 'server' | 'local'
  server: null,           // /api/health-svaret
  saveState: 'saved'      // 'saved' | 'saving' | 'error'
};

const listeners = new Map();
export function on(evt, fn) {
  if (!listeners.has(evt)) listeners.set(evt, new Set());
  listeners.get(evt).add(fn);
  return () => listeners.get(evt).delete(fn);
}
export function emit(evt, payload) {
  (listeners.get(evt) || []).forEach((fn) => { try { fn(payload); } catch (e) { console.error(e); } });
}

// ------------------------------------------------------------------ datum
export const DAY = 86400000;
export function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
export function parseDate(s) { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
export function isoDate(d) { const z = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; }
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
export function daysBetween(a, b) { return Math.round((b - a) / DAY); }

// ------------------------------------------------------------------ uppslag
export const uid = (p = 'x') => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const refKey = (r) => `${r.t}:${r.id}`;
export const parseKey = (k) => { const i = k.indexOf(':'); return { t: k.slice(0, i), id: k.slice(i + 1) }; };
export const sameRef = (a, b) => a && b && a.t === b.t && a.id === b.id;

export function all(t) { return store.db[TYPES[t].coll] || []; }
export function get(ref) { if (!ref || !TYPES[ref.t]) return null; return all(ref.t).find((x) => x.id === ref.id) || null; }

export function latestVersion(model) {
  return (model.versions || []).reduce((a, b) => (!a || b.v > a.v ? b : a), null);
}

/** Kort kod, t.ex. F12, DI-018, F12-123 */
export function codeOf(ref, e = get(ref)) {
  if (!e) return '';
  switch (ref.t) {
    case 'area': return e.code;
    case 'drawing': return e.number;
    case 'model': { const v = latestVersion(e); return v ? `v${v.v}` : ''; }
    case 'meeting': return e.date?.slice(5) || '';
    case 'document': return (e.kind || '').toUpperCase();
    case 'tool': return e.version ? `v${e.version}` : '';
    default: return e.code || '';
  }
}
export function titleOf(ref, e = get(ref)) {
  if (!e) return '(borttagen)';
  switch (ref.t) {
    case 'area': return `Område ${e.code} · ${e.name}`;
    case 'document': return e.subject || e.name;
    default: return e.name || e.title || e.code || e.id;
  }
}
export function labelOf(ref) { const c = codeOf(ref); const t = titleOf(ref); return c && !t.includes(c) ? `${c} ${t}` : t; }

/** Status för en entitet – aktiviteter räknas fram från datum och framdrift. */
export function statusOf(ref, e = get(ref)) {
  if (!e) return null;
  if (ref.t === 'activity') {
    const t = today();
    if (e.progress >= 100) return 'done';
    if (parseDate(e.end) < t) return 'late';
    if (parseDate(e.start) <= t) return 'active';
    return 'planned';
  }
  return e.status || null;
}

export function areaOf(ref, e = get(ref)) {
  if (!e) return null;
  if (ref.t === 'area') return e;
  if (e.areaId) return get({ t: 'area', id: e.areaId });
  if (e.packageId) { const p = get({ t: 'package', id: e.packageId }); if (p) return get({ t: 'area', id: p.areaId }); }
  return null;
}

export function packageProgress(pkg) {
  const acts = all('activity').filter((a) => a.packageId === pkg.id);
  if (!acts.length) return pkg.progress || 0;
  const tot = acts.reduce((s, a) => s + Math.max(1, daysBetween(parseDate(a.start), parseDate(a.end))), 0);
  const done = acts.reduce((s, a) => s + Math.max(1, daysBetween(parseDate(a.start), parseDate(a.end))) * (a.progress / 100), 0);
  return Math.round((done / tot) * 100);
}

export function areaProgress(area) {
  const pk = all('package').filter((p) => p.areaId === area.id);
  if (!pk.length) return 0;
  return Math.round(pk.reduce((s, p) => s + packageProgress(p), 0) / pk.length);
}

/**
 * Allt som hänger ihop med ref: explicita relationer plus strukturella
 * kopplingar via packageId/areaId. Returnerar [{ref, relId|null}].
 */
export function related(ref) {
  const out = new Map();
  const add = (r, relId = null) => {
    if (!r || sameRef(r, ref) || !get(r)) return;
    const k = refKey(r);
    if (!out.has(k) || relId) out.set(k, { ref: r, relId: relId || out.get(k)?.relId || null });
  };
  for (const rel of store.db.relations) {
    if (sameRef(rel.a, ref)) add(rel.b, rel.id);
    else if (sameRef(rel.b, ref)) add(rel.a, rel.id);
  }
  const e = get(ref);
  if (!e) return [];
  if (e.packageId) add({ t: 'package', id: e.packageId });
  if (e.areaId && ref.t !== 'package') add({ t: 'area', id: e.areaId });
  if (ref.t === 'package') {
    add({ t: 'area', id: e.areaId });
    for (const t of ['activity', 'issue', 'action']) all(t).filter((x) => x.packageId === e.id).forEach((x) => add({ t, id: x.id }));
  }
  if (ref.t === 'area') {
    for (const t of ['package', 'activity', 'drawing', 'model', 'issue', 'action']) {
      all(t).filter((x) => x.areaId === e.id).forEach((x) => add({ t, id: x.id }));
    }
  }
  return [...out.values()];
}
export function relatedOfType(ref, t) { return related(ref).filter((x) => x.ref.t === t); }

export function isLinked(a, b) {
  return store.db.relations.some((r) => (sameRef(r.a, a) && sameRef(r.b, b)) || (sameRef(r.a, b) && sameRef(r.b, a)));
}

export function people() {
  const s = new Set(store.db.people || []);
  for (const t of ['package', 'activity', 'issue', 'action']) all(t).forEach((x) => x.responsible && s.add(x.responsible));
  return [...s].sort((a, b) => a.localeCompare(b, 'sv'));
}
export function distinct(field, types = ['package', 'activity', 'drawing', 'issue', 'action', 'model']) {
  const s = new Set();
  types.forEach((t) => all(t).forEach((x) => x[field] && s.add(x[field])));
  return [...s].sort((a, b) => String(a).localeCompare(String(b), 'sv'));
}

export function nextCode(t, prefix, pad = 3) {
  let max = 0;
  all(t).forEach((x) => { const m = String(x.code || '').match(/(\d+)$/); if (m) max = Math.max(max, +m[1]); });
  return `${prefix}${String(max + 1).padStart(pad, '0')}`;
}

// ------------------------------------------------------------------ ändringar
let undoSnapshot = null;
let undoLabel = '';

function snapshot(label) { undoSnapshot = JSON.stringify(store.db); undoLabel = label; }
export function canUndo() { return !!undoSnapshot; }
export function undo() {
  if (!undoSnapshot) return false;
  store.db = JSON.parse(undoSnapshot);
  undoSnapshot = null;
  persist();
  emit('change', { type: 'undo' });
  return undoLabel;
}

export function log(text, ref = null, kind = 'edit') {
  store.db.history.unshift({ id: uid('h'), ts: new Date().toISOString(), text, ref, kind });
  if (store.db.history.length > 800) store.db.history.length = 800;
}

/** Kör en ändring: tar ögonblicksbild för ångra, loggar, sparar och signalerar. */
export function mutate(label, fn, { ref = null, kind = 'edit', silent = false } = {}) {
  snapshot(label);
  const result = fn(store.db);
  if (!silent) log(label, ref, kind);
  store.db.project.updated = new Date().toISOString();
  persist();
  emit('change', { type: kind, ref });
  return result;
}

export function create(t, data, label) {
  const e = { id: uid(t.slice(0, 2)), created: new Date().toISOString(), ...data };
  const ref = { t, id: e.id };
  mutate(label || `${TYPES[t].label} skapad: ${data.code ? data.code + ' ' : ''}${data.name || data.title || ''}`, (db) => db[TYPES[t].coll].unshift(e), { ref, kind: 'create' });
  return ref;
}

export function update(ref, patch, label) {
  const e = get(ref);
  if (!e) return;
  mutate(label || `${TYPES[ref.t].label} uppdaterad: ${labelOf(ref)}`, () => Object.assign(e, patch, { modified: new Date().toISOString() }), { ref });
}

export function remove(ref) {
  const name = labelOf(ref);
  mutate(`${TYPES[ref.t].label} borttagen: ${name}`, (db) => {
    const coll = db[TYPES[ref.t].coll];
    const i = coll.findIndex((x) => x.id === ref.id);
    if (i >= 0) coll.splice(i, 1);
    db.relations = db.relations.filter((r) => !sameRef(r.a, ref) && !sameRef(r.b, ref));
    db.whiteboard.cards = db.whiteboard.cards.filter((c) => !sameRef(c.ref, ref));
  }, { kind: 'delete' });
}

export function link(a, b) {
  if (sameRef(a, b) || isLinked(a, b)) return false;
  mutate(`${labelOf(a)} kopplad till ${labelOf(b)}`, (db) => db.relations.push({ id: uid('rel'), a, b, ts: new Date().toISOString() }), { ref: b, kind: 'link' });
  return true;
}

export function unlink(relId) {
  const rel = store.db.relations.find((r) => r.id === relId);
  if (!rel) return;
  mutate(`Koppling borttagen: ${labelOf(rel.a)} ↔ ${labelOf(rel.b)}`, (db) => { db.relations = db.relations.filter((r) => r.id !== relId); }, { ref: rel.b, kind: 'link' });
}

export function historyFor(ref) {
  return store.db.history.filter((h) => h.ref && (sameRef(h.ref, ref)));
}

// ------------------------------------------------------------------ lagring
const LS_KEY = 'pch.db.v1';
let saveTimer = null;

export function persist() {
  store.saveState = 'saving';
  emit('save', store.saveState);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 250);
}

async function flush() {
  try {
    const json = JSON.stringify(store.db);
    if (store.mode === 'server') {
      const r = await fetch('api/db', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: json });
      if (!r.ok) throw new Error(await r.text());
    } else {
      localStorage.setItem(LS_KEY, json);
    }
    store.saveState = 'saved';
  } catch (e) {
    console.error('Kunde inte spara', e);
    store.saveState = 'error';
  }
  emit('save', store.saveState);
}
window.addEventListener('beforeunload', () => { if (saveTimer && store.saveState === 'saving') { clearTimeout(saveTimer); flushSync(); } });
function flushSync() {
  const json = JSON.stringify(store.db);
  if (store.mode === 'server') navigator.sendBeacon?.('api/db', new Blob([json], { type: 'application/json' }));
  else try { localStorage.setItem(LS_KEY, json); } catch {}
}

function migrate(db) {
  const colls = ['areas', 'packages', 'activities', 'drawings', 'models', 'issues', 'actions', 'decisions', 'meetings', 'documents', 'relations', 'history', 'tools', 'savedFilters', 'people'];
  colls.forEach((c) => { if (!Array.isArray(db[c])) db[c] = []; });
  if (!db.whiteboard) db.whiteboard = { cards: [], view: { x: 0, y: 0, z: 1 } };
  if (!db.whiteboard.view) db.whiteboard.view = { x: 0, y: 0, z: 1 };
  if (!db.project) db.project = { name: 'Projekt' };
  return db;
}

export async function init() {
  try {
    const r = await fetch('api/health', { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      if (j && j.mode === 'server') { store.mode = 'server'; store.server = j; }
    }
  } catch { /* inget API – demoläge */ }

  let db = null;
  if (store.mode === 'server') {
    db = await (await fetch('api/db', { cache: 'no-store' })).json();
  } else {
    try { db = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { db = null; }
  }
  const fresh = !db;
  if (fresh) db = createSeed();
  store.db = migrate(db);
  if (fresh) persist();
  return { fresh };
}

export function resetToSeed() {
  snapshot('Återställ exempeldata');
  store.db = migrate(createSeed());
  persist();
  emit('change', { type: 'reset' });
}
export function clearAll() {
  snapshot('Töm all data');
  const keepTools = store.db.tools;
  store.db = migrate({ version: 1, project: { ...store.db.project, updated: new Date().toISOString() }, tools: keepTools });
  persist();
  emit('change', { type: 'reset' });
}

// ------------------------------------------------------------------ filer
const IDB_NAME = 'pch-files';
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('files');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function idbPut(key, blob) {
  const db = await idb();
  return new Promise((res, rej) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').put(blob, key); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
}
export async function idbGet(key) {
  const db = await idb();
  return new Promise((res, rej) => { const tx = db.transaction('files'); const q = tx.objectStore('files').get(key); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
}
export async function idbDel(key) {
  const db = await idb();
  return new Promise((res) => { const tx = db.transaction('files', 'readwrite'); tx.objectStore('files').delete(key); tx.oncomplete = res; tx.onerror = res; });
}

export function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] || '');
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}

/** Sparar en bilaga och returnerar filbeskrivningen som lagras på dokumentet. */
export async function storeAttachment(file) {
  if (store.mode === 'server') {
    const r = await fetch('api/attachments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, type: file.type, data: await fileToBase64(file) })
    });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Uppladdningen misslyckades');
    const j = await r.json();
    return { store: 'server', url: j.url, size: j.size };
  }
  const key = uid('blob');
  await idbPut(key, file);
  return { store: 'idb', key, size: file.size };
}

const urlCache = new Map();
export async function fileUrl(f) {
  if (!f) return null;
  if (f.store === 'server') return f.url;
  if (f.store === 'idb') {
    if (urlCache.has(f.key)) return urlCache.get(f.key);
    const blob = await idbGet(f.key);
    if (!blob) return null;
    const u = URL.createObjectURL(blob);
    urlCache.set(f.key, u);
    return u;
  }
  return f.url || null;
}

export function kindOfFile(file) {
  const n = file.name.toLowerCase();
  if (n.endsWith('.ifc') || n.endsWith('.ifczip')) return 'ifc';
  if (n.endsWith('.pdf')) return 'pdf';
  if (n.endsWith('.eml') || n.endsWith('.msg')) return 'email';
  if (/\.(dwg|dxf)$/.test(n)) return 'cad';
  if ((file.type || '').startsWith('image/') || /\.(png|jpe?g|gif|webp|heic|bmp)$/.test(n)) return 'photo';
  return 'file';
}
