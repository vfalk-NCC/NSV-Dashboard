// Globala filter som alla vyer delar. Ändras ett filter uppdateras hela den aktuella vyn direkt.
import { store, all, get, areaOf, statusOf, today, addDays, parseDate, distinct, people, STATUS, TYPES, uid, persist, emit, on } from './store.js';
import { h, icon, dropdown, popover, toast, formDialog, selectList } from './ui.js';

export const PERIODS = [
  { value: 'all', label: 'Hela tiden' },
  { value: '2w', label: 'Nästa 2 veckor', days: 14 },
  { value: '4w', label: 'Nästa 4 veckor', days: 28 },
  { value: '3m', label: 'Nästa 3 månader', days: 91 },
  { value: 'overdue', label: 'Försenat / förfallet' }
];
const DIMS = ['area', 'discipline', 'contractor', 'responsible', 'status', 'types'];
const blank = () => ({ area: [], discipline: [], contractor: [], responsible: [], status: [], types: [], period: 'all' });

export const filters = { cur: blank() };

const RECENT_KEY = 'pch.recentFilters';
function loadRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } }
function saveRecent(list) { try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6))); } catch {} }

try { const s = JSON.parse(sessionStorage.getItem('pch.filter') || 'null'); if (s) filters.cur = { ...blank(), ...s }; } catch {}

export function isActive(f = filters.cur) { return DIMS.some((d) => f[d]?.length) || f.period !== 'all'; }
export function activeCount(f = filters.cur) { return DIMS.reduce((n, d) => n + (f[d]?.length ? 1 : 0), 0) + (f.period !== 'all' ? 1 : 0); }

let recentTimer;
export function setFilter(patch, { remember = true } = {}) {
  filters.cur = { ...filters.cur, ...patch };
  try { sessionStorage.setItem('pch.filter', JSON.stringify(filters.cur)); } catch {}
  emit('filters', filters.cur);
  if (remember) {
    clearTimeout(recentTimer);
    recentTimer = setTimeout(() => {
      if (!isActive()) return;
      const key = JSON.stringify(filters.cur);
      const list = loadRecent().filter((r) => JSON.stringify(r.filter) !== key);
      list.unshift({ filter: filters.cur, ts: Date.now() });
      saveRecent(list);
    }, 1500);
  }
}
export function clearFilters() { setFilter(blank(), { remember: false }); }
export function applyFilter(f) { setFilter({ ...blank(), ...f }); }

/** Har entiteten (ref,e) godkänts av aktuella filter? opts.ignore = ['period', ...] */
export function matches(ref, e = get(ref), opts = {}) {
  const f = filters.cur, ig = new Set(opts.ignore || []);
  if (!e) return false;
  if (!ig.has('types') && f.types.length && !f.types.includes(ref.t)) return false;
  if (!ig.has('area') && f.area.length) {
    const a = areaOf(ref, e);
    if (a ? !f.area.includes(a.id) : ref.t !== 'meeting' && ref.t !== 'tool') return false;
  }
  for (const k of ['discipline', 'contractor', 'responsible']) {
    if (!ig.has(k) && f[k].length && e[k] !== undefined && !f[k].includes(e[k])) return false;
  }
  if (!ig.has('status') && f.status.length) {
    const s = statusOf(ref, e);
    if (s && !f.status.includes(s)) return false;
  }
  if (!ig.has('period') && f.period !== 'all') {
    const t = today();
    if (f.period === 'overdue') {
      if (ref.t === 'activity') return statusOf(ref, e) === 'late';
      if (ref.t === 'issue') return e.due && parseDate(e.due) < t && !['resolved', 'closed'].includes(e.status);
      if (ref.t === 'action') return e.due && parseDate(e.due) < t && e.status !== 'done';
      if (ref.t === 'package') return e.status === 'risk' || all('activity').some((a) => a.packageId === e.id && statusOf({ t: 'activity', id: a.id }, a) === 'late');
      return true;
    }
    const days = PERIODS.find((p) => p.value === f.period)?.days || 0;
    const end = addDays(t, days);
    if (ref.t === 'activity') return parseDate(e.start) <= end && parseDate(e.end) >= t;
    if (ref.t === 'issue' || ref.t === 'action') return e.due && parseDate(e.due) <= end && (parseDate(e.due) >= t || !['done', 'resolved', 'closed'].includes(e.status));
    if (ref.t === 'meeting') return parseDate(e.date) >= t && parseDate(e.date) <= end;
    if (ref.t === 'package') return all('activity').some((a) => a.packageId === e.id && parseDate(a.start) <= end && parseDate(a.end) >= t);
  }
  return true;
}
export function filtered(t, opts) { return all(t).filter((e) => matches({ t, id: e.id }, e, opts)); }

// ------------------------------------------------------------------ UI
function optionsFor(dim) {
  switch (dim) {
    case 'area': return all('area').map((a) => ({ value: a.id, label: `${a.code} ${a.name}`, color: a.color }));
    case 'discipline': return distinct('discipline').map((v) => ({ value: v, label: v }));
    case 'contractor': return distinct('contractor').map((v) => ({ value: v, label: v }));
    case 'responsible': return people().map((v) => ({ value: v, label: v }));
    case 'status': return ['planned', 'active', 'late', 'risk', 'done', 'open', 'inprogress', 'doing', 'resolved', 'review', 'construction', 'proposed', 'decided']
      .map((k) => ({ value: k, label: STATUS[k].label, hint: hintFor(k) }));
    case 'types': return ['package', 'activity', 'drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document'].map((t) => ({ value: t, label: TYPES[t].plural, icon: TYPES[t].icon }));
  }
  return [];
}
function hintFor(k) {
  return { planned: 'paket, aktivitet', active: 'paket, aktivitet', late: 'aktivitet', risk: 'paket', done: 'paket, aktivitet, åtgärd', open: 'ärende, åtgärd', inprogress: 'ärende', doing: 'åtgärd', resolved: 'ärende', review: 'ritning', construction: 'ritning', proposed: 'beslut', decided: 'beslut' }[k];
}
const DIM_LABEL = { area: 'Område', discipline: 'Disciplin', contractor: 'Entreprenör', responsible: 'Ansvarig', status: 'Status', types: 'Informationstyp' };
const DIM_ICON = { area: 'map', discipline: 'layers', contractor: 'users', responsible: 'user', status: 'target', types: 'grid' };

export function describe(f) {
  const parts = [];
  if (f.area?.length) parts.push(f.area.map((id) => get({ t: 'area', id })?.code || id).join(', '));
  for (const k of ['discipline', 'contractor', 'responsible']) if (f[k]?.length) parts.push(f[k].join(', '));
  if (f.status?.length) parts.push(f.status.map((s) => STATUS[s]?.label).join(', '));
  if (f.types?.length) parts.push(f.types.map((t) => TYPES[t].plural).join(', '));
  if (f.period && f.period !== 'all') parts.push(PERIODS.find((p) => p.value === f.period)?.label);
  return parts.join(' · ') || 'Inga filter';
}

/** Filterraden. dims = vilka dimensioner som är relevanta för vyn. */
export function filterBar({ dims = ['area', 'discipline', 'contractor', 'responsible', 'status'], period = true } = {}) {
  const f = filters.cur;
  const bar = h('div', { class: 'filterbar' });
  for (const d of dims) {
    bar.append(dropdown({ label: DIM_LABEL[d], iconName: DIM_ICON[d], options: optionsFor(d), value: f[d], multi: true, cls: 'dd-filter', onChange: (v) => setFilter({ [d]: v }) }));
  }
  if (period) {
    bar.append(dropdown({ label: 'Period', iconName: 'calendar', options: PERIODS, value: f.period, cls: `dd-filter ${f.period !== 'all' ? 'has-value' : ''}`, onChange: (v) => setFilter({ period: v }) }));
  }
  if (isActive()) bar.append(h('button', { class: 'btn ghost sm clear-filters', onclick: clearFilters, title: 'Rensa alla filter' }, icon('x', 13), 'Rensa'));
  bar.append(h('span', { class: 'grow' }));
  const menuBtn = h('button', { class: 'btn ghost sm', title: 'Sparade och senaste filter' }, icon('star', 13), 'Filter', icon('chevD', 13));
  menuBtn.onclick = () => openFilterMenu(menuBtn);
  bar.append(menuBtn);
  return bar;
}

function openFilterMenu(anchor) {
  const saved = store.db.savedFilters;
  const recent = loadRecent();
  let pop;
  const row = (title, sub, onClick, extra) => h('div', { class: 'fm-row', onclick: () => { onClick(); pop.close(); } }, h('div', h('b', title), h('small', sub)), extra);
  const content = h('div', { class: 'filter-menu' },
    h('div', { class: 'fm-sec' }, h('div', { class: 'fm-head' }, 'Sparade filter'),
      saved.length ? [...saved].sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0)).map((s) => row(s.name, describe(s.filter), () => applyFilter(s.filter),
        h('span', { class: 'fm-actions' },
          h('button', { class: `iconbtn sm ${s.fav ? 'fav' : ''}`, title: s.fav ? 'Ta bort favorit' : 'Favorit', onclick: (e) => { e.stopPropagation(); s.fav = !s.fav; persist(); emit('filters'); pop.close(); openFilterMenu(anchor); } }, icon('star', 13)),
          h('button', { class: 'iconbtn sm', title: 'Ta bort', onclick: (e) => { e.stopPropagation(); store.db.savedFilters = saved.filter((x) => x !== s); persist(); pop.close(); toast(`Filtret ”${s.name}” togs bort`); } }, icon('trash', 13)))))
        : h('div', { class: 'fm-empty' }, 'Inga sparade filter än.')),
    recent.length ? h('div', { class: 'fm-sec' }, h('div', { class: 'fm-head' }, 'Senast använda'), recent.map((r) => row(describe(r.filter), '', () => applyFilter(r.filter)))) : null,
    h('div', { class: 'fm-foot' },
      h('button', { class: 'btn sm', disabled: !isActive(), onclick: async () => { pop.close(); await saveCurrent(); } }, icon('save', 13), 'Spara aktuellt filter…')));
  pop = popover(anchor, content, { align: 'end', cls: 'pop-filter' });
}

export async function saveCurrent() {
  if (!isActive()) { toast('Välj några filter först'); return; }
  const v = await formDialog({ title: 'Spara filter', subtitle: describe(filters.cur), fields: [{ key: 'name', label: 'Namn', required: true, value: describe(filters.cur).slice(0, 40), full: true }], okLabel: 'Spara' });
  if (!v) return;
  store.db.savedFilters.push({ id: uid('sf'), name: v.name, fav: false, filter: { ...filters.cur } });
  persist();
  toast(`Filtret ”${v.name}” sparades`, { tone: 'ok' });
}

export function onFilters(fn) { return on('filters', fn); }
