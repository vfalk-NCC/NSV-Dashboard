import { store, all, get, statusOf, packageProgress, areaProgress, parseDate, today, addDays, daysBetween, STATUS, PRIORITY, codeOf, titleOf, refKey } from '../store.js';
import { h, icon, typeIcon, badge, prioBadge, avatar, progressBar, ring, fmtDate, relDays, ago, dueChip, dropTarget } from '../ui.js';
import { filterBar, filtered, matches, filters, setFilter } from '../filters.js';
import { bindEntity, createIssue, createAction, entityDropSpec } from '../actions.js';
import { app } from '../app.js';

export const meta = { id: 'overview', title: 'Översikt', icon: 'home' };

function kpi({ label, value, sub, tone = '', iconName, onClick, spark }) {
  return h('button', { class: `kpi ${tone}`, onclick: onClick },
    h('div', { class: 'kpi-top' }, h('span', label), iconName && icon(iconName, 15)),
    h('div', { class: 'kpi-value' }, value),
    h('div', { class: 'kpi-sub' }, sub),
    spark);
}

function bars(values, max) {
  return h('div', { class: 'spark' }, values.map((v) => h('i', { style: { height: `${max ? Math.max(6, (v / max) * 100) : 6}%` } })));
}

export function render(root) {
  const t = today();
  const acts = filtered('activity').map((e) => ({ ref: { t: 'activity', id: e.id }, e }));
  const issues = filtered('issue');
  const actions = filtered('action');
  const pkgs = filtered('package');
  const drawings = filtered('drawing');

  const late = acts.filter((x) => statusOf(x.ref, x.e) === 'late');
  const running = acts.filter((x) => statusOf(x.ref, x.e) === 'active');
  const openIssues = issues.filter((i) => !['resolved', 'closed'].includes(i.status));
  const highIssues = openIssues.filter((i) => i.priority === 'high');
  const overdueActions = actions.filter((a) => a.status !== 'done' && parseDate(a.due) < t);
  const openActions = actions.filter((a) => a.status !== 'done');
  const review = drawings.filter((d) => d.status === 'review');
  const totalPct = pkgs.length ? Math.round(pkgs.reduce((s, p) => s + packageProgress(p), 0) / pkgs.length) : 0;

  // Veckobelastning: antal aktiva aktiviteter per vecka, 8 veckor framåt
  const weekly = Array.from({ length: 8 }, (_, w) => {
    const s = addDays(t, w * 7), e = addDays(s, 6);
    return acts.filter((x) => parseDate(x.e.start) <= e && parseDate(x.e.end) >= s).length;
  });

  const attention = [
    ...late.map((x) => ({ ref: x.ref, why: `Försenad ${-daysBetween(t, parseDate(x.e.end))} d`, tone: 'bad', sort: 0 })),
    ...highIssues.map((i) => ({ ref: { t: 'issue', id: i.id }, why: `Hög prioritet · ${relDays(i.due)}`, tone: 'bad', sort: 1 })),
    ...overdueActions.map((a) => ({ ref: { t: 'action', id: a.id }, why: `Förfallen ${relDays(a.due)}`, tone: 'warn', sort: 2 })),
    ...pkgs.filter((p) => p.status === 'risk').map((p) => ({ ref: { t: 'package', id: p.id }, why: 'Markerad som risk', tone: 'warn', sort: 3 })),
    ...review.filter((d) => daysBetween(parseDate(d.date), t) <= 7).map((d) => ({ ref: { t: 'drawing', id: d.id }, why: `Granskning sedan ${fmtDate(d.date)}`, tone: 'info', sort: 4 }))
  ].sort((a, b) => a.sort - b.sort);

  const upcoming = acts.filter((x) => parseDate(x.e.start) >= t && parseDate(x.e.start) <= addDays(t, 28)).sort((a, b) => a.e.start.localeCompare(b.e.start));
  const milestones = acts.filter((x) => x.e.milestone && parseDate(x.e.end) >= t).sort((a, b) => a.e.end.localeCompare(b.e.end));

  const row = (ref, right, sub) => {
    const el = h('div', { class: 'list-row', tabindex: '0', dataset: { nav: '1' } },
      h('span', { class: `relrow-ic ti-${ref.t}` }, typeIcon(ref.t, 13)),
      h('b', { class: 'mono' }, codeOf(ref)),
      h('span', { class: 'lr-title' }, titleOf(ref).replace(codeOf(ref), '').trim(), sub && h('small', sub)),
      right);
    return bindEntity(el, ref);
  };

  const p = store.db.project;
  root.replaceChildren(h('div', { class: 'view view-overview' },
    h('div', { class: 'view-head' },
      h('div', h('h1', p.fullName || p.name), h('p', { class: 'muted' }, `${p.phase || ''} · ${all('area').length} områden · ${all('package').length} arbetspaket · uppdaterad ${ago(p.updated)}`)),
      h('div', { class: 'head-actions' },
        h('button', { class: 'btn', onclick: () => createIssue() }, icon('alert', 14), 'Nytt ärende'),
        h('button', { class: 'btn primary', onclick: () => createAction() }, icon('plus', 14), 'Ny åtgärd'))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible', 'types'] }),
    h('div', { class: 'kpis' },
      kpi({ label: 'Total framdrift', value: h('span', `${totalPct}`, h('small', '%')), sub: `${pkgs.filter((x) => x.status === 'done').length} av ${pkgs.length} paket klara`, iconName: 'target', spark: progressBar(totalPct, 'lg'), onClick: () => app.navigate('#/packages') }),
      kpi({ label: 'Aktiviteter pågår', value: running.length, sub: late.length ? h('span', { class: 'tone-text-bad' }, `${late.length} försenade`) : 'Inga försenade', tone: late.length ? 'k-bad' : '', iconName: 'gantt', spark: bars(weekly, Math.max(...weekly)), onClick: () => app.navigate('#/schedule') }),
      kpi({ label: 'Öppna ärenden', value: openIssues.length, sub: highIssues.length ? h('span', { class: 'tone-text-bad' }, `${highIssues.length} hög prioritet`) : 'Inga med hög prioritet', tone: highIssues.length ? 'k-warn' : '', iconName: 'alert', onClick: () => app.navigate('#/issues') }),
      kpi({ label: 'Åtgärder', value: openActions.length, sub: overdueActions.length ? h('span', { class: 'tone-text-warn' }, `${overdueActions.length} förfallna`) : 'Alla i tid', tone: overdueActions.length ? 'k-warn' : '', iconName: 'kanban', onClick: () => app.navigate('#/actions') }),
      kpi({ label: 'Ritningar i granskning', value: review.length, sub: `${drawings.filter((d) => d.status === 'construction').length} bygghandlingar`, iconName: 'drawing', onClick: () => app.navigate('#/library') })),
    h('div', { class: 'ov-grid' },
      h('div', { class: 'card span-2' },
        h('div', { class: 'card-head' }, h('h3', icon('flag', 15), 'Kräver uppmärksamhet'), h('em', attention.length)),
        h('div', { class: 'card-body list', dataset: { skey: 'att' } }, attention.length ? attention.slice(0, 12).map((a) => row(a.ref, h('span', { class: `why tone-${a.tone}` }, a.why))) : h('p', { class: 'muted pad' }, 'Inget kritiskt just nu. Snyggt.'))),
      h('div', { class: 'card' },
        h('div', { class: 'card-head' }, h('h3', icon('map', 15), 'Områden')),
        h('div', { class: 'card-body areas' }, all('area').map((a) => {
          const pct = areaProgress(a);
          const on = filters.cur.area.includes(a.id);
          const n = all('issue').filter((i) => i.areaId === a.id && !['resolved', 'closed'].includes(i.status)).length;
          const el = h('div', { class: `area-row ${on ? 'on' : ''}`, title: 'Klicka för att välja · Alt+klick filtrerar' },
            h('i', { class: 'area-sw', style: { background: a.color } }),
            h('div', { class: 'grow' }, h('div', { class: 'row-between' }, h('b', a.code, ' ', h('span', { class: 'muted' }, a.name)), h('span', { class: 'mono small' }, `${pct}%`)), progressBar(pct)),
            n ? h('span', { class: 'count-pill tone-warn', title: 'Öppna ärenden' }, n) : null);
          el.addEventListener('click', (ev) => { if (ev.altKey) { setFilter({ area: on ? [] : [a.id] }); ev.stopImmediatePropagation(); } }, true);
          return bindEntity(el, { t: 'area', id: a.id }, { drag: true, drop: false });
        }))),
      h('div', { class: 'card span-2' },
        h('div', { class: 'card-head' }, h('h3', icon('calendar', 15), 'Startar inom 4 veckor'), h('em', upcoming.length), h('span', { class: 'grow' }), h('button', { class: 'btn ghost sm', onclick: () => app.navigate('#/schedule') }, 'Tidplan', icon('chevR', 13))),
        h('div', { class: 'card-body list' }, upcoming.length ? upcoming.slice(0, 8).map((x) => row(x.ref, h('span', { class: 'when' }, fmtDate(x.e.start), h('small', relDays(x.e.start))), x.e.contractor)) : h('p', { class: 'muted pad' }, 'Inga aktiviteter startar under perioden.'))),
      h('div', { class: 'card' },
        h('div', { class: 'card-head' }, h('h3', icon('flag', 15), 'Milstolpar')),
        h('div', { class: 'card-body list' }, milestones.length ? milestones.map((x) => row(x.ref, h('span', { class: 'when' }, fmtDate(x.e.end), h('small', relDays(x.e.end))))) : h('p', { class: 'muted pad' }, 'Inga kommande milstolpar.'))),
      h('div', { class: 'card span-2' },
        h('div', { class: 'card-head' }, h('h3', icon('box', 15), 'Arbetspaket')),
        h('div', { class: 'card-body pk-mini' }, pkgs.map((pk) => {
          const ref = { t: 'package', id: pk.id };
          const pct = packageProgress(pk);
          const ni = all('issue').filter((i) => i.packageId === pk.id && !['resolved', 'closed'].includes(i.status)).length;
          const el = h('div', { class: 'pk-mini-row', tabindex: '0', dataset: { nav: '1' } },
            ring(pct, 30), h('div', { class: 'grow' }, h('b', pk.name), h('small', `${pk.contractor} · ${pk.responsible}`)),
            ni ? h('span', { class: 'count-pill tone-warn', title: 'Öppna ärenden' }, icon('alert', 11), ni) : null, badge(pk.status));
          return bindEntity(el, ref);
        }))),
      h('div', { class: 'card' },
        h('div', { class: 'card-head' }, h('h3', icon('history', 15), 'Senaste händelser')),
        h('div', { class: 'card-body' }, h('ol', { class: 'timeline' }, store.db.history.slice(0, 9).map((x) => h('li', {
          class: x.ref ? 'clickable' : '', onclick: () => x.ref && get(x.ref) && app.select(x.ref)
        }, h('i', { class: `tl-dot k-${x.kind}` }), h('div', h('span', x.text), h('small', ago(x.ts)))))))))));
}
