import { all, get, statusOf, packageProgress, parseDate, today, addDays, daysBetween, isoDate, STATUS, update, refKey } from '../store.js';
import { h, icon, badge, avatar, fmtDate, relDays, progressBar } from '../ui.js';
import { filterBar, filtered } from '../filters.js';
import { bindEntity } from '../actions.js';
import { app } from '../app.js';

export const meta = { id: 'schedule', title: 'Tidplan', icon: 'gantt' };

const ZOOMS = [{ v: 14, l: '2 v' }, { v: 28, l: '4 v' }, { v: 91, l: '3 mån' }, { v: 182, l: '6 mån' }];
const S_KEY = 'pch.schedule';
const st = (() => { try { return { days: 28, offset: -7, collapsed: [], ...JSON.parse(sessionStorage.getItem(S_KEY) || '{}') }; } catch { return { days: 28, offset: -7, collapsed: [] }; } })();
const save = () => { try { sessionStorage.setItem(S_KEY, JSON.stringify(st)); } catch {} };

const MON = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const WD = ['S', 'M', 'T', 'O', 'T', 'F', 'L'];
function weekNo(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  return Math.ceil(((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / 864e5 + 1) / 7);
}

let refs = null;

export function render(root, { scope } = {}) {
  const start = () => addDays(today(), st.offset);
  const rangeStart = start();
  let acts = filtered('activity');
  let pkgs = filtered('package', { ignore: ['period', 'status'] });
  if (scope) { acts = acts.filter((a) => a.packageId === scope); pkgs = pkgs.filter((p) => p.id === scope); }
  const groups = pkgs.map((p) => ({ p, acts: acts.filter((a) => a.packageId === p.id).sort((a, b) => a.start.localeCompare(b.start)) })).filter((g) => g.acts.length);

  const timeline = h('div', { class: 'gt-time' });
  const headEl = h('div', { class: 'gt-head' });
  const gridEl = h('div', { class: 'gt-grid' });
  const todayEl = h('div', { class: 'gt-today' }, h('span', 'Idag'));
  const bars = [];

  const pos = (s, e) => {
    const S = start(), d = st.days;
    const l = daysBetween(S, parseDate(s)) / d * 100;
    const w = (daysBetween(parseDate(s), parseDate(e)) + 1) / d * 100;
    return { l, w };
  };

  const rows = [];
  for (const g of groups) {
    const pref = { t: 'package', id: g.p.id };
    const isC = st.collapsed.includes(g.p.id);
    const gs = g.acts.reduce((m, a) => (a.start < m ? a.start : m), g.acts[0].start);
    const ge = g.acts.reduce((m, a) => (a.end > m ? a.end : m), g.acts[0].end);
    const pct = packageProgress(g.p);
    const label = h('div', { class: `gt-row gt-group ${isC ? 'collapsed' : ''}` },
      h('button', { class: 'iconbtn xs', title: isC ? 'Visa' : 'Dölj', onclick: () => { const i = st.collapsed.indexOf(g.p.id); i >= 0 ? st.collapsed.splice(i, 1) : st.collapsed.push(g.p.id); save(); app.render(); } }, icon(isC ? 'chevR' : 'chevD', 13)),
      h('b', { class: 'mono' }, g.p.code), h('span', { class: 'gt-name' }, g.p.name), h('span', { class: 'mono small muted' }, `${pct}%`));
    bindEntity(label, pref);
    const sumBar = h('div', { class: 'gt-bar gt-sum', title: `${g.p.name}: ${fmtDate(gs)} – ${fmtDate(ge)}` }, h('i', { style: { width: pct + '%' } }));
    bars.push({ el: sumBar, s: gs, e: ge });
    const lane = h('div', { class: 'gt-lane gt-lane-group' }, sumBar);
    bindEntity(lane, pref, { drag: false });
    rows.push([label, lane]);
    if (isC) continue;
    for (const a of g.acts) {
      const ref = { t: 'activity', id: a.id };
      const s = statusOf(ref, a);
      const label = h('div', { class: 'gt-row', tabindex: '0', dataset: { nav: '1' } },
        h('i', { class: `sdot tone-${STATUS[s].tone}`, title: STATUS[s].label }),
        h('span', { class: 'mono small muted' }, a.code),
        h('span', { class: 'gt-name' }, a.name),
        a.responsible && avatar(a.responsible, 18));
      bindEntity(label, ref);
      const bar = h('div', { class: `gt-bar st-${s} ${a.milestone ? 'milestone' : ''}`, title: `${a.code} ${a.name}\n${fmtDate(a.start)} – ${fmtDate(a.end)} · ${a.progress}%` },
        !a.milestone && h('i', { style: { width: a.progress + '%' } }),
        h('span', { class: 'gt-bar-label' }, a.milestone ? a.name : `${a.name}`));
      bindEntity(bar, ref);
      bars.push({ el: bar, s: a.start, e: a.end, ms: a.milestone });
      const lane = h('div', { class: 'gt-lane' }, bar);
      rows.push([label, lane]);
    }
  }

  const left = h('div', { class: 'gt-left', dataset: { skey: 'gt-left' } }, h('div', { class: 'gt-left-head' }, 'Aktivitet'), rows.map((r) => r[0]));
  const lanes = h('div', { class: 'gt-lanes' }, gridEl, todayEl, rows.map((r) => r[1]));
  timeline.append(headEl, lanes);

  const applyRange = () => {
    const S = start(), d = st.days;
    for (const b of bars) {
      const p = pos(b.s, b.e);
      b.el.style.left = p.l + '%';
      b.el.style.width = b.ms ? '' : Math.max(p.w, 0.4) + '%';
      const vis = p.w + Math.min(0, p.l);            // synlig bredd i %
      b.el.classList.toggle('narrow', vis < 9);
      const lab = b.el.querySelector('.gt-bar-label');
      if (lab && !b.ms) lab.style.marginLeft = p.l < 0 && vis >= 9 ? `${(-p.l / p.w) * 100}%` : '';
      b.el.classList.toggle('off', p.l + p.w < 0 || p.l > 100);
    }
    const tl = daysBetween(S, today()) / d * 100;
    todayEl.style.left = tl + '%';
    todayEl.style.display = tl < 0 || tl > 100 ? 'none' : '';
    // rubriker
    const top = [], bottom = [], grid = [];
    const unit = d <= 31 ? 'day' : d <= 120 ? 'week' : 'month';
    let cur = new Date(S), lastMonth = -1;
    for (let i = 0; i < d; i++) {
      const x = addDays(S, i);
      const left = i / d * 100;
      if (x.getMonth() !== lastMonth) { top.push(h('span', { class: 'gt-m', style: { left: left + '%' } }, `${MON[x.getMonth()]} ${x.getFullYear()}`)); lastMonth = x.getMonth(); }
      if (unit === 'day') {
        bottom.push(h('span', { class: `gt-d ${[0, 6].includes(x.getDay()) ? 'we' : ''} ${isoDate(x) === isoDate(today()) ? 'now' : ''}`, style: { left: left + '%', width: 100 / d + '%' } }, h('b', x.getDate()), h('small', WD[x.getDay()])));
        if ([0, 6].includes(x.getDay())) grid.push(h('i', { class: 'gt-we', style: { left: left + '%', width: 100 / d + '%' } }));
      } else if (unit === 'week' && x.getDay() === 1) {
        bottom.push(h('span', { class: 'gt-w', style: { left: left + '%', width: 700 / d + '%' } }, `v${weekNo(x)}`));
        grid.push(h('i', { class: 'gt-line', style: { left: left + '%' } }));
      } else if (unit === 'month' && x.getDate() === 1) {
        grid.push(h('i', { class: 'gt-line', style: { left: left + '%' } }));
      }
      if (unit === 'month' && x.getDay() === 1 && weekNo(x) % 2 === 0) bottom.push(h('span', { class: 'gt-w', style: { left: left + '%' } }, `v${weekNo(x)}`));
    }
    headEl.replaceChildren(h('div', { class: 'gt-head-top' }, top), h('div', { class: 'gt-head-bottom' }, bottom));
    gridEl.replaceChildren(...grid);
    rangeLabel.textContent = `${fmtDate(S)} – ${fmtDate(addDays(S, d - 1), true)}`;
    save();
  };

  const rangeLabel = h('span', { class: 'range-label' });
  const zoomSeg = h('div', { class: 'seg' }, ZOOMS.map((z) => h('button', { class: st.days === z.v ? 'on' : '', onclick: (e) => {
    const center = st.offset + st.days / 2;
    st.days = z.v; st.offset = Math.round(center - z.v / 2);
    if (z.v <= 28) st.offset = Math.min(st.offset, -2);
    zoomSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === e.currentTarget));
    applyRange();
  } }, z.l)));
  const step = (dir) => { st.offset += Math.round(st.days / (st.days <= 28 ? 2 : 3)) * dir; applyRange(); };

  const tools = h('div', { class: 'toolbar' },
    zoomSeg,
    h('div', { class: 'btn-group' },
      h('button', { class: 'btn sm ghost', onclick: () => step(-1), title: 'Tidigare (←)' }, icon('chevL', 14)),
      h('button', { class: 'btn sm ghost', onclick: () => { st.offset = st.days <= 28 ? -3 : -7; applyRange(); }, title: 'Gå till idag (T)' }, 'Idag'),
      h('button', { class: 'btn sm ghost', onclick: () => step(1), title: 'Senare (→)' }, icon('chevR', 14))),
    rangeLabel,
    h('span', { class: 'grow' }),
    h('div', { class: 'legend' }, ['planned', 'active', 'late', 'done'].map((s) => h('span', h('i', { class: `lg st-${s}` }), STATUS[s].label)), h('span', h('i', { class: 'lg ms' }), 'Milstolpe')),
    h('button', { class: 'btn sm ghost', title: 'Fäll ihop/ut alla', onclick: () => { st.collapsed = st.collapsed.length ? [] : groups.map((g) => g.p.id); save(); app.render(); } }, icon('layers', 14)));

  const body = groups.length ? h('div', { class: `gantt ${scope ? 'embedded' : ''}`, dataset: { skey: 'gantt' } }, left, timeline)
    : h('div', { class: 'empty' }, h('b', 'Inga aktiviteter matchar filtren'), h('p', 'Ändra eller rensa filter för att se fler.'));

  // synka vertikal scroll mellan vänster lista och tidslinje (de ligger i samma scrollcontainer)
  const view = h('div', { class: `view view-schedule ${scope ? 'scoped' : ''}` },
    !scope && h('div', { class: 'view-head' }, h('div', h('h1', 'Tidplan'), h('p', { class: 'muted' }, `${acts.length} aktiviteter i ${groups.length} arbetspaket`))),
    !scope && filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible', 'status'] }),
    tools, body);
  root.replaceChildren(view);
  // Första gången: placera utan animation
  view.classList.add('no-anim');
  applyRange();
  requestAnimationFrame(() => requestAnimationFrame(() => view.classList.remove('no-anim')));

  refs = { step, applyRange, today: () => { st.offset = st.days <= 28 ? -3 : -7; applyRange(); } };
}

export function keys(e) {
  if (!refs) return false;
  if (e.key === 'ArrowLeft') { refs.step(-1); return true; }
  if (e.key === 'ArrowRight') { refs.step(1); return true; }
  if (e.key === 't' || e.key === 'T') { refs.today(); return true; }
  return false;
}
