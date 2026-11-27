import { all, get, STATUS, PRIORITY, parseDate, today } from '../store.js';
import { h, icon, badge, prioBadge, avatar, fmtDate, dueChip, emptyState } from '../ui.js';
import { filterBar, filtered, filters } from '../filters.js';
import { bindEntity, createIssue } from '../actions.js';
import { app } from '../app.js';

export const meta = { id: 'issues', title: 'Ärenden', icon: 'alert' };

const st = { sort: 'priority', dir: 1, quick: 'open', q: '' };
const PRI = { high: 0, medium: 1, low: 2 };

const COLS = [
  { id: 'code', label: 'ID', w: '84px', get: (e) => h('b', { class: 'mono' }, e.code), sort: (e) => e.code },
  { id: 'priority', label: 'Prio', w: '44px', get: (e) => prioBadge(e.priority), sort: (e) => PRI[e.priority] ?? 9 },
  { id: 'name', label: 'Rubrik', w: 'minmax(140px,2.4fr)', get: (e) => h('span', { class: 'ellipsis' }, e.name), sort: (e) => e.name },
  { id: 'status', label: 'Status', w: '120px', get: (e) => badge(e.status), sort: (e) => ['open', 'inprogress', 'resolved', 'closed'].indexOf(e.status) },
  { id: 'package', label: 'Paket', w: '64px', get: (e) => e.packageId && h('span', { class: 'mono chip' }, get({ t: 'package', id: e.packageId })?.code), sort: (e) => get({ t: 'package', id: e.packageId })?.code || '' },
  { id: 'discipline', label: 'Disciplin', w: 'minmax(70px,100px)', get: (e) => h('span', { class: 'muted' }, e.discipline || ''), sort: (e) => e.discipline || '' },
  { id: 'responsible', label: 'Ansvarig', w: 'minmax(100px,140px)', get: (e) => e.responsible && h('span', { class: 'pk-person' }, avatar(e.responsible, 18), e.responsible), sort: (e) => e.responsible || '' },
  { id: 'due', label: 'Deadline', w: '88px', get: (e) => dueChip(e.due, ['resolved', 'closed'].includes(e.status)), sort: (e) => e.due || '9' }
];

export function render(root) {
  let list = filtered('issue');
  const counts = { open: list.filter((e) => ['open', 'inprogress'].includes(e.status)).length, all: list.length, mine: 0, overdue: list.filter((e) => e.due && parseDate(e.due) < today() && !['resolved', 'closed'].includes(e.status)).length };
  if (st.quick === 'open') list = list.filter((e) => ['open', 'inprogress'].includes(e.status));
  if (st.quick === 'overdue') list = list.filter((e) => e.due && parseDate(e.due) < today() && !['resolved', 'closed'].includes(e.status));
  if (st.q) { const q = st.q.toLowerCase(); list = list.filter((e) => `${e.code} ${e.name} ${e.description || ''}`.toLowerCase().includes(q)); }
  const col = COLS.find((c) => c.id === st.sort);
  list.sort((a, b) => { const x = col.sort(a), y = col.sort(b); return (x > y ? 1 : x < y ? -1 : 0) * st.dir || (PRI[a.priority] - PRI[b.priority]); });

  const grid = COLS.map((c) => c.w).join(' ');
  root.replaceChildren(h('div', { class: 'view view-issues' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Ärenden'), h('p', { class: 'muted' }, 'Avvikelser, kollisioner och frågor. Klicka för kontext, högerklicka för snabbval.')),
      h('div', { class: 'head-actions' }, h('button', { class: 'btn primary', onclick: () => createIssue() }, icon('plus', 14), 'Nytt ärende', h('kbd', 'I')))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible'] }),
    h('div', { class: 'toolbar' },
      h('div', { class: 'seg' }, [['open', 'Öppna', counts.open], ['overdue', 'Förfallna', counts.overdue], ['all', 'Alla', counts.all]].map(([k, l, n]) => h('button', { class: st.quick === k ? 'on' : '', onclick: () => { st.quick = k; app.render(); } }, l, h('em', n)))),
      h('label', { class: 'search-inline' }, icon('search', 14), h('input', { placeholder: 'Sök i ärenden…', value: st.q, dataset: { fkey: 'issue-q' }, oninput: (e) => { st.q = e.target.value; app.render(); } }))),
    list.length ? h('div', { class: 'tbl big', dataset: { skey: 'issues' } },
      h('div', { class: 'tbl-head', style: { gridTemplateColumns: grid } }, COLS.map((c) => h('button', { class: `th ${st.sort === c.id ? 'on' : ''}`, onclick: () => { st.dir = st.sort === c.id ? -st.dir : 1; st.sort = c.id; app.render(); } }, c.label, st.sort === c.id && icon(st.dir > 0 ? 'chevD' : 'chevU', 12)))),
      list.map((e) => {
        const row = h('div', { class: `tbl-row pri-${e.priority}`, tabindex: '0', dataset: { nav: '1' }, style: { gridTemplateColumns: grid } }, COLS.map((c) => h('span', c.get(e))));
        return bindEntity(row, { t: 'issue', id: e.id });
      })) : emptyState('Inga ärenden här', st.quick === 'open' ? 'Inga öppna ärenden matchar filtren.' : 'Inget matchar filtren.')));
}
