// Gemensamma kommandon: skapa, koppla, ändra status, bifoga filer, menyer.
import {
  store, TYPES, STATUS, STATUS_SETS, PRIORITY, get, all, labelOf, codeOf, titleOf, statusOf, refKey, parseKey, sameRef,
  create, update, remove, link, unlink, mutate, undo, people, distinct, nextCode, isLinked, uid, today, isoDate, addDays,
  storeAttachment, kindOfFile, latestVersion, fileUrl, persist, emit
} from './store.js';
import { h, icon, typeIcon, toast, confirmDialog, formDialog, modal, norm, contextMenu, fmtDate, makeDraggable, dropTarget, $, $$ } from './ui.js';
import { app } from './app.js';

const undoAction = { label: 'Ångra', fn: () => { const l = undo(); if (l) toast(`Ångrade: ${l}`); } };

// ------------------------------------------------------------------ favoriter
export function isFav(ref) { return (store.db.favourites || []).includes(refKey(ref)); }
export function toggleFav(ref) {
  const k = refKey(ref);
  store.db.favourites = store.db.favourites || [];
  const on = !store.db.favourites.includes(k);
  store.db.favourites = on ? [k, ...store.db.favourites] : store.db.favourites.filter((x) => x !== k);
  persist(); emit('change', { type: 'fav', ref });
  toast(on ? `${labelOf(ref)} tillagd i favoriter` : `${labelOf(ref)} borttagen från favoriter`, { iconName: 'star' });
}

// ------------------------------------------------------------------ länkar
export function deepLink(ref) { return `${location.origin}${location.pathname}#/item/${ref.t}/${encodeURIComponent(ref.id)}`; }
export async function copyLink(ref) {
  const url = deepLink(ref);
  try { await navigator.clipboard.writeText(url); toast('Länk kopierad', { tone: 'ok', iconName: 'link' }); }
  catch { toast(url, { timeout: 8000 }); }
}

// ------------------------------------------------------------------ koppla
export function linkWithFeedback(a, b) {
  if (sameRef(a, b)) return;
  if (isLinked(a, b)) { toast(`${labelOf(a)} är redan kopplad till ${labelOf(b)}`); return; }
  link(a, b);
  toast(h('span', h('b', codeOf(a) || titleOf(a)), ' kopplad till ', h('b', labelOf(b))), { tone: 'ok', iconName: 'link', action: undoAction });
}

/** Sökbar väljare för entiteter. */
export function pickEntity({ title = 'Välj', types, exclude = [], onPick, multi = false }) {
  const ex = new Set(exclude.map(refKey));
  const items = types.flatMap((t) => all(t).map((e) => ({ ref: { t, id: e.id }, e }))).filter((x) => !ex.has(refKey(x.ref)));
  let q = '', act = 0, view = items;
  const chosen = new Set();
  const input = h('input', { class: 'input pick-search', placeholder: `Sök ${types.map((t) => TYPES[t].plural.toLowerCase()).join(', ')}…` });
  const list = h('div', { class: 'pick-list' });
  const render = () => {
    const n = norm(q).split(/\s+/).filter(Boolean);
    view = items.filter((x) => { const hay = norm(`${codeOf(x.ref, x.e)} ${titleOf(x.ref, x.e)} ${x.e.discipline || ''}`); return n.every((w) => hay.includes(w)); }).slice(0, 80);
    act = Math.min(act, Math.max(0, view.length - 1));
    list.replaceChildren(...view.map((x, i) => h('div', { class: `pick-row ${i === act ? 'act' : ''} ${chosen.has(refKey(x.ref)) ? 'on' : ''}`, onclick: () => choose(x), onpointerenter: () => { act = i; mark(); } },
      multi && h('span', { class: 'cbox' }, icon('check', 12)), typeIcon(x.ref.t, 14), h('b', codeOf(x.ref, x.e)), h('span', { class: 'grow ellipsis' }, titleOf(x.ref, x.e)),
      statusOf(x.ref, x.e) && h('small', STATUS[statusOf(x.ref, x.e)]?.label))));
    if (!view.length) list.append(h('div', { class: 'sl-empty' }, 'Inga träffar'));
  };
  const mark = () => $$('.pick-row', list).forEach((r, i) => r.classList.toggle('act', i === act));
  const choose = (x) => {
    if (multi) { const k = refKey(x.ref); chosen.has(k) ? chosen.delete(k) : chosen.add(k); render(); return; }
    m.close(); onPick(x.ref);
  };
  input.addEventListener('input', () => { q = input.value; act = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { act = Math.min(view.length - 1, act + 1); mark(); $('.pick-row.act', list)?.scrollIntoView({ block: 'nearest' }); e.preventDefault(); }
    if (e.key === 'ArrowUp') { act = Math.max(0, act - 1); mark(); $('.pick-row.act', list)?.scrollIntoView({ block: 'nearest' }); e.preventDefault(); }
    if (e.key === 'Enter' && !e.ctrlKey) { if (view[act]) choose(view[act]); e.preventDefault(); }
  });
  const m = modal({
    title, body: h('div', { class: 'picker' }, input, list), width: 560,
    actions: multi ? [{ spacer: true }, { label: 'Avbryt', ghost: true }, { label: 'Koppla valda', primary: true, onClick: () => onPick([...chosen].map(parseKey)) }] : []
  });
  render();
}

export function linkPicker(ref, types) {
  const ex = [ref, ...store.db.relations.filter((r) => sameRef(r.a, ref) || sameRef(r.b, ref)).map((r) => (sameRef(r.a, ref) ? r.b : r.a))];
  pickEntity({
    title: `Koppla till ${labelOf(ref)}`, types, exclude: ex, multi: true,
    onPick: (refs) => {
      if (!refs.length) return;
      mutate(`${refs.length} kopplingar till ${labelOf(ref)}`, (db) => refs.forEach((r) => db.relations.push({ id: uid('rel'), a: r, b: ref, ts: new Date().toISOString() })), { ref, kind: 'link' });
      toast(`${refs.length} ${refs.length === 1 ? 'koppling' : 'kopplingar'} till ${labelOf(ref)}`, { tone: 'ok', iconName: 'link', action: undoAction });
    }
  });
}

// ------------------------------------------------------------------ status, tilldela, deadline
export function setStatus(ref, status) {
  const e = get(ref); if (!e || e.status === status) return;
  const patch = { status };
  if (ref.t === 'package' && status === 'done') patch.progress = 100;
  mutate(`${TYPES[ref.t].label} ${codeOf(ref)} ändrad till ${STATUS[status].label}`, () => Object.assign(e, patch, { modified: new Date().toISOString() }), { ref, kind: 'status' });
  toast(h('span', h('b', codeOf(ref)), ' → ', STATUS[status].label), { tone: status === 'done' || status === 'resolved' ? 'ok' : 'info', action: undoAction });
}
export function assign(ref, person) {
  update(ref, { responsible: person }, `${codeOf(ref)} tilldelad ${person}`);
  toast(h('span', h('b', codeOf(ref)), ` tilldelad ${person}`), { action: undoAction, iconName: 'user' });
}
export async function changeDeadline(ref) {
  const e = get(ref);
  const field = ref.t === 'activity' ? 'end' : 'due';
  const v = await formDialog({ title: `Ändra ${ref.t === 'activity' ? 'slutdatum' : 'deadline'}`, subtitle: labelOf(ref), fields: [{ key: 'd', label: 'Datum', type: 'date', value: e[field] || isoDate(today()), required: true, full: true }] });
  if (!v) return;
  update(ref, { [field]: v.d }, `${codeOf(ref)} ny deadline ${fmtDate(v.d)}`);
  toast(h('span', h('b', codeOf(ref)), ` ny deadline ${fmtDate(v.d)}`), { action: undoAction, iconName: 'calendar' });
}
export async function addNote(ref) {
  const v = await formDialog({ title: 'Lägg till anteckning', subtitle: labelOf(ref), fields: [{ key: 'text', label: 'Anteckning', type: 'textarea', rows: 4, required: true }] });
  if (!v) return;
  const e = get(ref);
  mutate(`Anteckning på ${labelOf(ref)}`, () => { e.notes = [{ id: uid('n'), ts: new Date().toISOString(), text: v.text }, ...(e.notes || [])]; }, { ref, kind: 'note' });
  toast('Anteckning sparad', { tone: 'ok', iconName: 'note' });
}

export async function deleteEntity(ref) {
  const ok = await confirmDialog({ title: `Ta bort ${TYPES[ref.t].label.toLowerCase()}?`, text: `${labelOf(ref)} och dess kopplingar tas bort. Du kan ångra direkt efteråt.`, okLabel: 'Ta bort', danger: true });
  if (!ok) return;
  if (sameRef(app.selection, ref)) app.select(null);
  remove(ref);
  toast(`${labelOf(ref) || TYPES[ref.t].label} borttagen`, { action: undoAction, iconName: 'trash' });
}

// ------------------------------------------------------------------ whiteboard
export function addToWhiteboard(ref, pos) {
  const wb = store.db.whiteboard;
  if (wb.cards.some((c) => sameRef(c.ref, ref))) { toast(`${labelOf(ref)} finns redan på whiteboarden`); return; }
  const n = wb.cards.length;
  const p = pos || { x: 60 + (n % 4) * 300 - wb.view.x, y: 60 + Math.floor(n / 4) * 170 - wb.view.y };
  mutate(`${labelOf(ref)} lagd på whiteboarden`, () => wb.cards.push({ id: uid('wb'), ref, x: Math.round(p.x), y: Math.round(p.y) }), { ref, kind: 'whiteboard' });
  toast(h('span', h('b', codeOf(ref) || titleOf(ref)), ' lagd på whiteboarden'), { tone: 'ok', iconName: 'board', action: { label: 'Visa', fn: () => app.navigate('#/whiteboard') } });
}

// ------------------------------------------------------------------ filer
export async function attachFiles(ref, files) {
  const list = [...files];
  if (!list.length) return;
  const ifcs = list.filter((f) => kindOfFile(f) === 'ifc');
  let n = 0;
  for (const file of list) {
    try {
      const f = await storeAttachment(file);
      const kind = kindOfFile(file);
      const doc = { id: uid('do'), kind, name: file.name, subject: file.name.replace(/\.[^.]+$/, ''), date: isoDate(today()), file: { ...f, type: file.type }, size: file.size, created: new Date().toISOString() };
      if (ref && ref.t === 'package') doc.packageId = ref.id;
      mutate(`${file.name} bifogad till ${ref ? labelOf(ref) : 'projektet'}`, (db) => {
        db.documents.unshift(doc);
        if (ref && ref.t !== 'package') db.relations.push({ id: uid('rel'), a: { t: 'document', id: doc.id }, b: ref, ts: new Date().toISOString() });
      }, { ref, kind: 'attach' });
      n++;
    } catch (e) { toast(`${file.name}: ${e.message}`, { tone: 'bad' }); }
  }
  if (n) {
    const kinds = list.map(kindOfFile);
    const what = n === 1 ? ({ pdf: 'PDF', photo: 'Bild', email: 'E-post', ifc: 'IFC-fil' }[kinds[0]] || 'Fil') + ` ”${list[0].name}”` : `${n} filer`;
    toast(h('span', `${what} bifogad till `, h('b', ref ? labelOf(ref) : 'projektet')), { tone: 'ok', iconName: 'paperclip', action: undoAction });
  }
  if (ifcs.length) toast('Tips: släpp IFC-filer på Modellkontroll för att skapa en ny modellversion.', { timeout: 6000, iconName: 'cube' });
}

export async function readIfcHeader(file) {
  const text = await file.slice(0, 64 * 1024).text();
  const schema = (text.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i) || [])[1] || '';
  const fname = (text.match(/FILE_NAME\s*\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*\(\s*'([^']*)'/i) || []);
  const app = (text.match(/FILE_NAME\s*\([^;]*?'([^']*)'\s*,\s*'([^']*)'\s*,\s*'[^']*'\s*\)\s*;/i) || [])[1] || '';
  const valid = /ISO-10303-21/.test(text.slice(0, 200));
  return { valid, schema, originalName: fname[1] || '', created: fname[2] || '', author: fname[3] || '', application: app };
}

export async function importIfc(file, preselect) {
  const head = await readIfcHeader(file);
  if (!head.valid && !/\.ifczip$/i.test(file.name)) {
    toast(`${file.name} ser inte ut som en IFC-fil (saknar ISO-10303-21-huvud)`, { tone: 'bad' });
    return;
  }
  const models = all('model');
  const guess = preselect || models.find((m) => norm(file.name).includes(norm(m.discipline).slice(0, 4)) || norm(file.name).includes(norm(m.name).split(' ')[0]));
  const v = await formDialog({
    title: 'Ny modellversion',
    subtitle: `${file.name} · ${head.schema || 'okänt schema'}${head.application ? ' · ' + head.application : ''}`,
    fields: [
      { key: 'model', label: 'Modell', type: 'select', options: [...models.map((m) => ({ value: m.id, label: `${m.name} (senast v${latestVersion(m)?.v ?? 0})` })), { value: '__new', label: '+ Ny modell…' }], value: guess?.id || models[0]?.id, full: true },
      { key: 'newName', label: 'Namn på ny modell', placeholder: 'Endast om ny modell', value: '' },
      { key: 'discipline', label: 'Disciplin (ny modell)', list: distinct('discipline'), value: '' },
      { key: 'note', label: 'Ändringsnotering', type: 'textarea', rows: 2, placeholder: 'Vad är nytt i versionen?' }
    ],
    okLabel: 'Skapa version'
  });
  if (!v) return;
  let modelRef;
  if (v.model === '__new') {
    if (!v.newName) { toast('Ange namn på den nya modellen', { tone: 'warn' }); return; }
    modelRef = create('model', { name: v.newName, discipline: v.discipline || 'Övrigt', versions: [] }, `Modell skapad: ${v.newName}`);
  } else modelRef = { t: 'model', id: v.model };
  const m = get(modelRef);
  const f = await storeAttachment(file);
  const nv = (latestVersion(m)?.v || 0) + 1;
  mutate(`${m.name} v${nv} importerad`, () => {
    m.versions.push({ v: nv, date: isoDate(today()), author: head.author || 'Jag', note: v.note || file.name, schema: head.schema, file: { ...f, name: file.name }, size: file.size, application: head.application });
  }, { ref: modelRef, kind: 'create' });
  toast(h('span', h('b', `${m.name} v${nv}`), ' skapad'), { tone: 'ok', iconName: 'cube', action: undoAction });
  app.select(modelRef);
}

export async function openSource(ref) {
  const e = get(ref);
  let f = e?.file;
  if (ref.t === 'model') f = latestVersion(e)?.file;
  const url = await fileUrl(f);
  if (url) window.open(url, '_blank', 'noopener');
  else if (e?.source) window.open(e.source, '_blank', 'noopener');
  else toast('Ingen källfil kopplad ännu – dra en fil hit för att bifoga.', { iconName: 'info' });
}

// ------------------------------------------------------------------ skapa
export async function createIssue(defaults = {}) {
  const pk = all('package');
  const v = await formDialog({
    title: 'Nytt ärende', subtitle: nextCode('issue', 'DI-'),
    fields: [
      { key: 'name', label: 'Rubrik', required: true, full: true },
      { key: 'packageId', label: 'Arbetspaket', type: 'select', options: [{ value: '', label: '—' }, ...pk.map((p) => ({ value: p.id, label: `${p.code} ${p.name}` }))], value: defaults.packageId || '' },
      { key: 'priority', label: 'Prioritet', type: 'select', options: Object.entries(PRIORITY).map(([k, p]) => ({ value: k, label: p.label })), value: 'medium' },
      { key: 'responsible', label: 'Ansvarig', list: people(), value: defaults.responsible || '' },
      { key: 'due', label: 'Förfallodatum', type: 'date', value: isoDate(addDays(today(), 7)) },
      { key: 'discipline', label: 'Disciplin', list: distinct('discipline'), value: defaults.discipline || '' },
      { key: 'description', label: 'Beskrivning', type: 'textarea' }
    ], okLabel: 'Skapa ärende'
  });
  if (!v) return null;
  const p = pk.find((x) => x.id === v.packageId);
  const ref = create('issue', { code: nextCode('issue', 'DI-'), status: 'open', ...v, packageId: v.packageId || null, areaId: p?.areaId || defaults.areaId || null, contractor: p?.contractor, discipline: v.discipline || p?.discipline });
  if (defaults.linkTo) link(ref, defaults.linkTo);
  toast(h('span', 'Ärende ', h('b', get(ref).code), ' skapat'), { tone: 'ok', action: undoAction });
  app.select(ref);
  return ref;
}
export async function createAction(defaults = {}) {
  const pk = all('package');
  const v = await formDialog({
    title: 'Ny åtgärd', subtitle: nextCode('action', 'A-'),
    fields: [
      { key: 'name', label: 'Vad ska göras?', required: true, full: true, value: defaults.name || '' },
      { key: 'packageId', label: 'Arbetspaket', type: 'select', options: [{ value: '', label: '—' }, ...pk.map((p) => ({ value: p.id, label: `${p.code} ${p.name}` }))], value: defaults.packageId || '' },
      { key: 'responsible', label: 'Ansvarig', list: people(), value: defaults.responsible || '' },
      { key: 'due', label: 'Deadline', type: 'date', value: isoDate(addDays(today(), 5)) },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_SETS.action.map((s) => ({ value: s, label: STATUS[s].label })), value: defaults.status || 'open' }
    ], okLabel: 'Skapa åtgärd'
  });
  if (!v) return null;
  return quickAction(v.name, { ...defaults, ...v });
}
export function quickAction(name, o = {}) {
  const p = o.packageId ? get({ t: 'package', id: o.packageId }) : null;
  const ref = create('action', { code: nextCode('action', 'A-'), name, status: o.status || 'open', responsible: o.responsible || '', due: o.due || isoDate(addDays(today(), 5)), packageId: o.packageId || null, areaId: p?.areaId || null, discipline: p?.discipline, contractor: p?.contractor });
  if (o.linkTo) link(ref, o.linkTo);
  toast(h('span', 'Åtgärd ', h('b', get(ref).code), ' skapad'), { tone: 'ok', action: undoAction });
  return ref;
}
export async function createDecision(defaults = {}) {
  const v = await formDialog({
    title: 'Nytt beslut', subtitle: nextCode('decision', 'B-'),
    fields: [
      { key: 'name', label: 'Beslut', required: true, full: true },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_SETS.decision.map((s) => ({ value: s, label: STATUS[s].label })), value: 'proposed' },
      { key: 'date', label: 'Datum', type: 'date', value: isoDate(today()) },
      { key: 'responsible', label: 'Ansvarig', list: people() },
      { key: 'description', label: 'Beskrivning', type: 'textarea' }
    ]
  });
  if (!v) return null;
  const p = defaults.packageId ? get({ t: 'package', id: defaults.packageId }) : null;
  const ref = create('decision', { code: nextCode('decision', 'B-'), ...v, packageId: defaults.packageId || null, areaId: p?.areaId || null });
  if (defaults.linkTo) link(ref, defaults.linkTo);
  app.select(ref);
  return ref;
}
export async function createMeeting(defaults = {}) {
  const v = await formDialog({
    title: 'Nytt möte',
    fields: [
      { key: 'name', label: 'Rubrik', required: true, full: true },
      { key: 'kind', label: 'Typ', list: ['Byggmöte', 'Projektering', 'Samordning', 'Arbetsberedning'], value: 'Samordning' },
      { key: 'date', label: 'Datum', type: 'date', value: isoDate(today()) },
      { key: 'notes', label: 'Anteckningar', type: 'textarea', rows: 4 }
    ]
  });
  if (!v) return null;
  const p = defaults.packageId ? get({ t: 'package', id: defaults.packageId }) : null;
  const ref = create('meeting', { ...v, packageId: defaults.packageId || null, areaId: p?.areaId || null });
  if (defaults.linkTo) link(ref, defaults.linkTo);
  app.select(ref);
  return ref;
}

export async function editEntity(ref) {
  const e = get(ref);
  const common = [];
  if (e.name !== undefined || ['issue', 'action', 'package', 'activity', 'decision', 'meeting', 'drawing'].includes(ref.t)) common.push({ key: 'name', label: 'Namn', value: e.name, full: true, required: true });
  if ('responsible' in e || ['issue', 'action', 'package', 'activity', 'decision'].includes(ref.t)) common.push({ key: 'responsible', label: 'Ansvarig', list: people(), value: e.responsible || '' });
  if (ref.t === 'activity') common.push({ key: 'start', label: 'Start', type: 'date', value: e.start }, { key: 'end', label: 'Slut', type: 'date', value: e.end }, { key: 'progress', label: 'Framdrift %', type: 'number', min: 0, max: 100, value: e.progress });
  if (ref.t === 'issue' || ref.t === 'action') common.push({ key: 'due', label: 'Deadline', type: 'date', value: e.due });
  if (ref.t === 'issue') common.push({ key: 'priority', label: 'Prioritet', type: 'select', options: Object.entries(PRIORITY).map(([k, p]) => ({ value: k, label: p.label })), value: e.priority });
  if (ref.t === 'drawing') common.push({ key: 'number', label: 'Nummer', value: e.number }, { key: 'rev', label: 'Revision', value: e.rev }, { key: 'source', label: 'Källa (URL)', value: e.source || '', full: true });
  if ('discipline' in e) common.push({ key: 'discipline', label: 'Disciplin', list: distinct('discipline'), value: e.discipline || '' });
  if ('contractor' in e) common.push({ key: 'contractor', label: 'Entreprenör', list: distinct('contractor'), value: e.contractor || '' });
  if ('description' in e || ['issue', 'package', 'decision'].includes(ref.t)) common.push({ key: 'description', label: 'Beskrivning', type: 'textarea', value: e.description || '' });
  if (ref.t === 'meeting') common.push({ key: 'date', label: 'Datum', type: 'date', value: e.date }, { key: 'notes', label: 'Anteckningar', type: 'textarea', rows: 5, value: e.notes || '' });
  const v = await formDialog({ title: `Redigera ${TYPES[ref.t].label.toLowerCase()}`, subtitle: labelOf(ref), fields: common });
  if (!v) return;
  if (v.progress != null) v.progress = Math.max(0, Math.min(100, v.progress));
  update(ref, v);
  toast('Ändringarna sparades', { tone: 'ok', action: undoAction });
}

// ------------------------------------------------------------------ menyer
export function entityMenu(ref, extra = []) {
  const e = get(ref); if (!e) return [];
  const t = ref.t;
  const statusSub = STATUS_SETS[t] && t !== 'activity' ? STATUS_SETS[t].map((s) => ({ label: STATUS[s].label, checked: e.status === s, action: () => setStatus(ref, s) })) : null;
  const assignSub = ['action', 'issue', 'package', 'activity', 'decision'].includes(t) ? people().map((p) => ({ label: p, checked: e.responsible === p, action: () => assign(ref, p) })) : null;
  const items = [
    { label: 'Öppna', icon: 'eye', kbd: '↵', action: () => app.open(ref) },
    { label: 'Öppna i flytande fönster', icon: 'window', kbd: '⇧ Klick', action: () => app.openFloat(ref) },
    (e.file || e.source || t === 'model' || t === 'drawing') && { label: 'Öppna källa', icon: 'external', action: () => openSource(ref) },
    { label: 'Kopiera länk', icon: 'link', action: () => copyLink(ref) },
    { label: isFav(ref) ? 'Ta bort från favoriter' : 'Lägg till i favoriter', icon: 'star', action: () => toggleFav(ref) },
    { divider: true },
    statusSub && { label: 'Ändra status', icon: 'target', submenu: statusSub },
    assignSub && { label: 'Tilldela', icon: 'user', submenu: assignSub },
    ['action', 'issue', 'activity'].includes(t) && { label: t === 'activity' ? 'Ändra slutdatum…' : 'Ändra deadline…', icon: 'calendar', action: () => changeDeadline(ref) },
    t !== 'activity' && t !== 'package' && t !== 'area' && { label: 'Koppla till aktivitet…', icon: 'calendar', action: () => linkPicker(ref, ['activity']) },
    t !== 'package' && t !== 'area' && { label: 'Koppla till arbetspaket…', icon: 'box', action: () => linkPicker(ref, ['package']) },
    { label: 'Koppla information…', icon: 'link', action: () => linkPicker(ref, ['drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document', 'activity', 'package'].filter((x) => x !== t)) },
    { label: 'Lägg på whiteboard', icon: 'board', action: () => addToWhiteboard(ref) },
    (t === 'drawing' || t === 'model') && { label: 'Visa revisionshistorik', icon: 'history', action: () => app.select(ref, { tab: 'history' }) },
    { label: 'Lägg till anteckning…', icon: 'note', action: () => addNote(ref) },
    ['issue', 'package', 'activity', 'drawing'].includes(t) && { label: 'Skapa åtgärd härifrån…', icon: 'check', action: () => createAction({ linkTo: ref, packageId: t === 'package' ? e.id : e.packageId }) },
    ...extra,
    { divider: true },
    t !== 'area' && { label: 'Redigera…', icon: 'note', kbd: 'E', action: () => editEntity(ref) },
    t !== 'area' && { label: 'Ta bort…', icon: 'trash', danger: true, action: () => deleteEntity(ref) }
  ];
  return items.filter(Boolean);
}

export function showEntityMenu(e, ref, extra) {
  e.preventDefault(); e.stopPropagation();
  contextMenu(e.clientX, e.clientY, entityMenu(ref, extra));
}

/** Kopplar klick/dubbelklick/högerklick/drag på ett element till en entitet. */
export function bindEntity(el, ref, { open = 'dbl', drop = true, drag = true } = {}) {
  el.dataset.ref = refKey(ref);
  el.addEventListener('click', (ev) => {
    if (ev.target.closest('button, a, input, select, .no-select')) return;
    if (ev.shiftKey) { app.openFloat(ref); return; }
    if (open === 'click') app.open(ref); else app.select(ref);
  });
  if (open === 'dbl') el.addEventListener('dblclick', (ev) => { if (!ev.target.closest('button, input')) app.open(ref); });
  el.addEventListener('contextmenu', (ev) => showEntityMenu(ev, ref));
  if (drag) makeDraggable(el, ref);
  if (drop) dropTarget(el, entityDropSpec(ref));
  if (sameRef(app.selection, ref)) el.classList.add('selected');
  return el;
}

/** Standardregler för att släppa saker på en entitet. */
export function entityDropSpec(ref) {
  return {
    accept: (src) => (src.ref ? !sameRef(src.ref, ref) && src.ref.t !== 'tool' && ref.t !== 'area' : src.files && ref.t !== 'area'),
    label: (src) => src?.ref ? `Koppla till ${labelOf(ref)}` : `Bifoga till ${labelOf(ref)}`,
    onDrop: (src) => {
      if (src.ref) linkWithFeedback(src.ref, ref);
      else attachFiles(ref, src.files);
    }
  };
}
