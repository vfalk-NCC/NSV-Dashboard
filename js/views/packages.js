import { store, all, get, related, relatedOfType, statusOf, packageProgress, codeOf, titleOf, latestVersion, STATUS, PRIORITY, historyFor, refKey, fileUrl, unlink } from '../store.js';
import { h, icon, typeIcon, badge, prioBadge, avatar, progressBar, ring, fmtDate, relDays, ago, dueChip, emptyState, dropTarget, docIcon, hueOf, fmtSize } from '../ui.js';
import { filterBar, filtered } from '../filters.js';
import { bindEntity, entityDropSpec, attachFiles, linkWithFeedback, linkPicker, createIssue, createAction, createDecision, createMeeting, editEntity, importIfc } from '../actions.js';
import { renderContext } from '../context.js';
import * as schedule from './schedule.js';
import { app } from '../app.js';

export const meta = { id: 'packages', title: 'Arbetspaket', icon: 'box' };

const counters = (p) => {
  const ref = { t: 'package', id: p.id };
  return {
    issues: all('issue').filter((i) => i.packageId === p.id && !['resolved', 'closed'].includes(i.status)).length,
    actions: all('action').filter((a) => a.packageId === p.id && a.status !== 'done').length,
    drawings: relatedOfType(ref, 'drawing').length,
    docs: all('document').filter((d) => d.packageId === p.id).length + relatedOfType(ref, 'document').length
  };
};

export function render(root) {
  const pkgs = filtered('package');
  const byArea = all('area').map((a) => ({ a, list: pkgs.filter((p) => p.areaId === a.id) })).filter((g) => g.list.length);
  root.replaceChildren(h('div', { class: 'view view-packages' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Arbetspaket'), h('p', { class: 'muted' }, `${pkgs.length} paket · klicka för att visa i kontextpanelen, dubbelklicka för att öppna · dra filer eller information på ett kort för att koppla`))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible', 'status'] }),
    byArea.length ? byArea.map(({ a, list }) => h('section', { class: 'pk-area' },
      h('div', { class: 'pk-area-head' }, h('i', { class: 'area-sw', style: { background: a.color } }), h('h3', `Område ${a.code}`), h('span', { class: 'muted' }, a.name), h('em', list.length)),
      h('div', { class: 'pk-grid' }, list.map((p) => {
        const ref = { t: 'package', id: p.id };
        const pct = packageProgress(p);
        const c = counters(p);
        const card = h('article', { class: `pk-card st-${p.status}`, tabindex: '0', dataset: { nav: '1' } },
          h('div', { class: 'pk-card-top' }, h('span', { class: 'mono pk-code' }, p.code), h('span', { class: 'muted small' }, p.kind), h('span', { class: 'grow' }), badge(p.status)),
          h('h4', p.name),
          h('p', { class: 'pk-desc' }, p.description),
          h('div', { class: 'pk-prog' }, progressBar(pct), h('span', { class: 'mono small' }, `${pct}%`)),
          h('div', { class: 'pk-meta' },
            h('span', { class: 'pk-person' }, avatar(p.responsible, 18), p.responsible),
            h('span', { class: 'grow' }),
            c.issues ? h('span', { class: 'count-pill tone-warn', title: 'Öppna ärenden' }, icon('alert', 11), c.issues) : null,
            c.actions ? h('span', { class: 'count-pill', title: 'Öppna åtgärder' }, icon('check', 11), c.actions) : null,
            h('span', { class: 'count-pill', title: 'Ritningar' }, icon('drawing', 11), c.drawings),
            c.docs ? h('span', { class: 'count-pill', title: 'Dokument' }, icon('paperclip', 11), c.docs) : null),
          h('button', { class: 'pk-open', onclick: () => app.open(ref), title: 'Öppna arbetsyta' }, 'Öppna', icon('chevR', 13)));
        return bindEntity(card, ref);
      })))) : emptyState('Inga arbetspaket matchar filtren', 'Ändra filter eller rensa dem.')));
}

// ------------------------------------------------------------------ arbetsyta för ett paket
const TABS = [
  { id: 'overview', label: 'Översikt', icon: 'home' },
  { id: 'schedule', label: 'Tidplan', icon: 'gantt' },
  { id: 'drawings', label: 'Ritningar', icon: 'drawing' },
  { id: 'models', label: 'Modeller', icon: 'cube' },
  { id: 'issues', label: 'Ärenden', icon: 'alert' },
  { id: 'actions', label: 'Åtgärder', icon: 'check' },
  { id: 'decisions', label: 'Beslut', icon: 'gavel' },
  { id: 'meetings', label: 'Möten', icon: 'users' },
  { id: 'emails', label: 'E-post', icon: 'mail' },
  { id: 'photos', label: 'Foton', icon: 'image' },
  { id: 'documents', label: 'Dokument', icon: 'paperclip' },
  { id: 'history', label: 'Historik', icon: 'history' }
];

function collect(p) {
  const ref = { t: 'package', id: p.id };
  const rel = related(ref);
  const of = (t) => rel.filter((r) => r.ref.t === t).map((r) => ({ ...r, e: get(r.ref) }));
  const docs = [
    ...all('document').filter((d) => d.packageId === p.id).map((d) => ({ ref: { t: 'document', id: d.id }, relId: null, e: d })),
    ...of('document').filter((x) => x.e.packageId !== p.id)
  ];
  // dokument kopplade till paketets ärenden/aktiviteter räknas också
  const indirect = new Map();
  for (const x of [...of('issue'), ...of('activity'), ...of('decision')]) {
    for (const r of relatedOfType(x.ref, 'document')) if (!docs.some((d) => d.ref.id === r.ref.id)) indirect.set(r.ref.id, { ref: r.ref, relId: null, e: get(r.ref), via: x.ref });
  }
  const allDocs = [...docs, ...indirect.values()];
  return {
    activities: of('activity').sort((a, b) => a.e.start.localeCompare(b.e.start)),
    drawings: of('drawing'), models: of('model'),
    issues: of('issue'), actions: of('action'), decisions: of('decision'),
    meetings: [...of('meeting'), ...all('meeting').filter((m) => m.packageId === p.id && !of('meeting').some((x) => x.e.id === m.id)).map((m) => ({ ref: { t: 'meeting', id: m.id }, relId: null, e: m }))],
    emails: allDocs.filter((d) => d.e.kind === 'email'),
    photos: allDocs.filter((d) => d.e.kind === 'photo'),
    documents: allDocs.filter((d) => !['email', 'photo'].includes(d.e.kind)),
    history: store.db.history.filter((x) => x.ref && (x.ref.id === p.id || rel.some((r) => r.ref.id === x.ref.id)))
  };
}

function table(cols, items, opts = {}) {
  if (!items.length) return emptyState(opts.emptyTitle || 'Inget här än', opts.emptyText || 'Dra information hit eller använd knappen ovan.', opts.emptyAction);
  return h('div', { class: 'tbl', role: 'table' },
    h('div', { class: 'tbl-head', role: 'row', style: { gridTemplateColumns: cols.map((c) => c.w || '1fr').join(' ') } }, cols.map((c) => h('span', c.label))),
    items.map((x) => {
      const row = h('div', { class: 'tbl-row', role: 'row', tabindex: '0', dataset: { nav: '1' }, style: { gridTemplateColumns: cols.map((c) => c.w || '1fr').join(' ') } }, cols.map((c) => h('span', { class: c.cls || '' }, c.get(x))));
      bindEntity(row, x.ref);
      if (x.relId) row.append(h('button', { class: 'iconbtn xs row-unlink', title: 'Ta bort koppling', onclick: (e) => { e.stopPropagation(); unlink(x.relId); } }, icon('x', 12)));
      return row;
    }));
}

export function renderPackage(root, id, tab = 'overview') {
  const p = get({ t: 'package', id });
  if (!p) { root.replaceChildren(emptyState('Arbetspaketet finns inte', 'Det kan ha tagits bort.', h('button', { class: 'btn', onclick: () => app.navigate('#/packages') }, 'Till arbetspaket'))); return; }
  const ref = { t: 'package', id };
  const area = get({ t: 'area', id: p.areaId });
  const c = collect(p);
  const pct = packageProgress(p);
  if (!TABS.some((t) => t.id === tab)) tab = 'overview';
  const counts = { schedule: c.activities.length, drawings: c.drawings.length, models: c.models.length, issues: c.issues.filter((x) => !['resolved', 'closed'].includes(x.e.status)).length, actions: c.actions.filter((x) => x.e.status !== 'done').length, decisions: c.decisions.length, meetings: c.meetings.length, emails: c.emails.length, photos: c.photos.length, documents: c.documents.length };

  const tabBar = h('nav', { class: 'tabs', role: 'tablist' },
    TABS.map((t, i) => h('a', { class: `tab ${t.id === tab ? 'on' : ''}`, href: `#/package/${id}/${t.id}`, role: 'tab', title: i < 9 ? `${t.label} (${i + 1})` : t.label, dataset: { tab: t.id } },
      icon(t.icon, 14), t.label, counts[t.id] ? h('em', { class: t.id === 'issues' && counts.issues ? 'warn' : '' }, counts[t.id]) : null)),
    h('i', { class: 'tab-ink' }));

  const content = h('div', { class: 'tab-content' }, tabContent(tab, p, ref, c));

  const header = h('div', { class: 'pkg-head' },
    h('div', { class: 'pkg-title' },
      ring(pct, 54),
      h('div', h('div', { class: 'pkg-kicker' }, h('span', { class: 'mono' }, p.code), h('span', p.kind), h('span', { class: 'mono' }, p.wbs), badge(p.status)),
        h('h1', p.name),
        h('p', { class: 'muted' }, p.description))),
    h('div', { class: 'pkg-facts' },
      fact('Ansvarig', h('span', { class: 'pk-person' }, avatar(p.responsible, 18), p.responsible)),
      fact('Entreprenör', p.contractor), fact('Disciplin', p.discipline),
      fact('Område', area ? `${area.code} ${area.name}` : '–'),
      fact('Öppna ärenden', h('b', { class: counts.issues ? 'tone-text-warn' : '' }, counts.issues))),
    h('div', { class: 'head-actions' },
      h('button', { class: 'btn ghost', onclick: () => editEntity(ref) }, icon('note', 14), 'Redigera'),
      h('button', { class: 'btn ghost', onclick: () => app.select(ref) }, icon('panelR', 14), 'Kontext'),
      h('button', { class: 'btn primary', onclick: () => createAction({ packageId: id }) }, icon('plus', 14), 'Åtgärd')));

  const view = h('div', { class: 'view view-package' }, header, tabBar, content);
  dropTarget(view, {
    accept: (src) => (src.ref ? src.ref.t !== 'package' && src.ref.t !== 'tool' && src.ref.t !== 'area' : !!src.files),
    label: (src) => src?.ref ? `Koppla till ${p.name}` : `Bifoga till ${p.name}`,
    onDrop: (src) => src.ref ? linkWithFeedback(src.ref, ref) : attachFiles(ref, src.files)
  });
  root.replaceChildren(view);
  requestAnimationFrame(() => moveInk(tabBar, false));
}

function moveInk(bar, animate = true) {
  const on = bar.querySelector('.tab.on'), ink = bar.querySelector('.tab-ink');
  if (!on || !ink) return;
  if (!animate) ink.style.transition = 'none';
  ink.style.width = on.offsetWidth + 'px';
  ink.style.transform = `translateX(${on.offsetLeft}px)`;
  if (!animate) requestAnimationFrame(() => (ink.style.transition = ''));
  on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

/** Byter flik utan att rendera om headern – snabbt och behåller kontext. */
export function switchTab(root, id, tab) {
  const bar = root.querySelector('.tabs'), content = root.querySelector('.tab-content');
  const p = get({ t: 'package', id });
  if (!bar || !content || !p) return renderPackage(root, id, tab);
  bar.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === tab));
  moveInk(bar);
  const next = h('div', { class: 'tab-content entering' }, tabContent(tab, p, { t: 'package', id }, collect(p)));
  content.replaceWith(next);
  requestAnimationFrame(() => next.classList.remove('entering'));
}

const fact = (l, v) => h('div', { class: 'fact' }, h('small', l), h('span', v));

function sectionHead(title, ...actions) { return h('div', { class: 'tab-head' }, h('h3', title), h('span', { class: 'grow' }), actions); }

function tabContent(tab, p, ref, c) {
  const linkBtn = (types, label = 'Koppla') => h('button', { class: 'btn sm ghost', onclick: () => linkPicker(ref, types) }, icon('link', 13), label);
  switch (tab) {
    case 'overview': {
      const next = c.activities.filter((x) => statusOf(x.ref, x.e) !== 'done').slice(0, 5);
      return h('div', { class: 'pkg-overview' },
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('gantt', 15), 'Aktiviteter')), h('div', { class: 'card-body list' }, next.length ? next.map((x) => miniRow(x, h('span', { class: 'when' }, fmtDate(x.e.start), h('small', `${x.e.progress}%`)))) : h('p', { class: 'muted pad' }, 'Alla aktiviteter klara.'))),
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('alert', 15), 'Öppna ärenden')), h('div', { class: 'card-body list' }, c.issues.filter((x) => !['resolved', 'closed'].includes(x.e.status)).map((x) => miniRow(x, h('span', prioBadge(x.e.priority), dueChip(x.e.due)))), !c.issues.length && h('p', { class: 'muted pad' }, 'Inga ärenden.'))),
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('check', 15), 'Åtgärder')), h('div', { class: 'card-body list' }, c.actions.filter((x) => x.e.status !== 'done').map((x) => miniRow(x, h('span', badge(x.e.status), dueChip(x.e.due)))), !c.actions.length && h('p', { class: 'muted pad' }, 'Inga åtgärder.'))),
        h('div', { class: 'card' }, h('div', { class: 'card-head' }, h('h3', icon('drawing', 15), 'Ritningar & modeller')), h('div', { class: 'card-body list' }, [...c.drawings, ...c.models].map((x) => miniRow(x, x.ref.t === 'drawing' ? h('span', h('span', { class: 'mono small muted' }, `Rev ${x.e.rev}`), ' ', badge(x.e.status)) : h('span', h('span', { class: 'muted small' }, x.e.discipline), ' ', h('span', { class: 'chip mono' }, `v${latestVersion(x.e)?.v}`)))))),
        h('div', { class: 'card span-2 drop-card' }, h('div', { class: 'big-drop' }, icon('upload', 22), h('b', 'Släpp filer här'), h('span', 'PDF, foton, e-post (.eml) eller ritningar bifogas till ', h('b', p.name), '. Dra en ritning, ett ärende eller ett mejl hit för att koppla det.'))));
    }
    case 'schedule': {
      const el = h('div', { class: 'embedded-schedule' });
      schedule.render(el, { scope: p.id });
      return el;
    }
    case 'drawings':
      return [sectionHead('Ritningar', linkBtn(['drawing'], 'Koppla ritning')),
        table([
          { label: 'Nummer', w: '110px', get: (x) => h('b', { class: 'mono' }, x.e.number) },
          { label: 'Titel', w: '2fr', get: (x) => x.e.name },
          { label: 'Rev', w: '60px', get: (x) => h('span', { class: 'mono' }, x.e.rev) },
          { label: 'Status', w: '130px', get: (x) => badge(x.e.status) },
          { label: 'Datum', w: '90px', get: (x) => fmtDate(x.e.date) },
          { label: 'Kopplad till', w: '1fr', get: (x) => relatedOfType(x.ref, 'activity').map((r) => h('span', { class: 'mono small chip' }, get(r.ref).code)) }
        ], c.drawings, { emptyText: 'Dra en ritning från biblioteket eller kontextpanelen hit.' })];
    case 'models':
      return [sectionHead('Modeller', linkBtn(['model'], 'Koppla modell')),
        h('div', { class: 'model-cards' }, c.models.map((x) => modelCard(x)), !c.models.length && emptyState('Inga modeller kopplade', 'Koppla en modell eller släpp en IFC-fil i Modellkontroll.'))];
    case 'issues':
      return [sectionHead('Ärenden', linkBtn(['issue']), h('button', { class: 'btn sm', onclick: () => createIssue({ packageId: p.id }) }, icon('plus', 13), 'Nytt ärende')),
        table([
          { label: 'ID', w: '80px', get: (x) => h('b', { class: 'mono' }, x.e.code) },
          { label: '', w: '28px', get: (x) => prioBadge(x.e.priority) },
          { label: 'Rubrik', w: '2fr', get: (x) => x.e.name },
          { label: 'Status', w: '130px', get: (x) => badge(x.e.status) },
          { label: 'Ansvarig', w: '140px', get: (x) => x.e.responsible && h('span', { class: 'pk-person' }, avatar(x.e.responsible, 18), x.e.responsible) },
          { label: 'Deadline', w: '90px', get: (x) => dueChip(x.e.due, ['resolved', 'closed'].includes(x.e.status)) }
        ], c.issues)];
    case 'actions':
      return [sectionHead('Åtgärder', h('button', { class: 'btn sm', onclick: () => createAction({ packageId: p.id }) }, icon('plus', 13), 'Ny åtgärd')),
        table([
          { label: 'ID', w: '80px', get: (x) => h('b', { class: 'mono' }, x.e.code) },
          { label: 'Åtgärd', w: '2fr', get: (x) => x.e.name },
          { label: 'Status', w: '110px', get: (x) => badge(x.e.status) },
          { label: 'Ansvarig', w: '140px', get: (x) => x.e.responsible && h('span', { class: 'pk-person' }, avatar(x.e.responsible, 18), x.e.responsible) },
          { label: 'Deadline', w: '90px', get: (x) => dueChip(x.e.due, x.e.status === 'done') }
        ], c.actions)];
    case 'decisions':
      return [sectionHead('Beslut', linkBtn(['decision']), h('button', { class: 'btn sm', onclick: () => createDecision({ packageId: p.id, linkTo: ref }) }, icon('plus', 13), 'Nytt beslut')),
        table([
          { label: 'ID', w: '80px', get: (x) => h('b', { class: 'mono' }, x.e.code) },
          { label: 'Beslut', w: '2fr', get: (x) => x.e.name },
          { label: 'Status', w: '110px', get: (x) => badge(x.e.status) },
          { label: 'Datum', w: '90px', get: (x) => fmtDate(x.e.date) },
          { label: 'Källor', w: '80px', get: (x) => h('span', { class: 'count-pill' }, icon('paperclip', 11), relatedOfType(x.ref, 'document').length) }
        ], c.decisions, { emptyText: 'Dra ett mejl eller dokument på ett beslut för att lägga till det som källa.' })];
    case 'meetings':
      return [sectionHead('Möten', linkBtn(['meeting']), h('button', { class: 'btn sm', onclick: () => createMeeting({ packageId: p.id, linkTo: ref }) }, icon('plus', 13), 'Nytt möte')),
        table([
          { label: 'Datum', w: '90px', get: (x) => h('b', fmtDate(x.e.date)) },
          { label: 'Möte', w: '1.4fr', get: (x) => x.e.name },
          { label: 'Typ', w: '120px', get: (x) => x.e.kind },
          { label: 'Anteckningar', w: '2fr', cls: 'ellipsis muted', get: (x) => x.e.notes }
        ], c.meetings)];
    case 'emails':
      return [sectionHead('E-post', h('span', { class: 'muted small' }, 'Dra .eml-filer hit')),
        table([
          { label: 'Datum', w: '80px', get: (x) => fmtDate(x.e.date) },
          { label: 'Ämne', w: '2fr', get: (x) => h('b', x.e.subject) },
          { label: 'Från', w: '1fr', cls: 'muted', get: (x) => x.e.from || '' },
          { label: 'Via', w: '110px', get: (x) => x.via ? h('span', { class: 'mono small chip' }, get(x.via)?.code) : '' }
        ], c.emails, { emptyTitle: 'Ingen e-post kopplad', emptyText: 'Dra ett mejl (.eml) från datorn hit.' })];
    case 'photos':
      return [sectionHead('Foton', h('span', { class: 'muted small' }, 'Dra bilder hit')),
        c.photos.length ? h('div', { class: 'photo-grid' }, c.photos.map((x) => photoTile(x))) : emptyState('Inga foton', 'Dra bilder från datorn hit för att bifoga dem.')];
    case 'documents':
      return [sectionHead('Dokument', h('span', { class: 'muted small' }, 'Dra PDF:er och andra filer hit')),
        table([
          { label: '', w: '28px', get: (x) => icon(docIcon(x.e.kind), 14) },
          { label: 'Namn', w: '2fr', get: (x) => h('b', x.e.name) },
          { label: 'Typ', w: '70px', get: (x) => h('span', { class: 'mono small' }, (x.e.kind || '').toUpperCase()) },
          { label: 'Storlek', w: '80px', cls: 'muted', get: (x) => fmtSize(x.e.size) },
          { label: 'Datum', w: '90px', get: (x) => fmtDate(x.e.date) }
        ], c.documents, { emptyTitle: 'Inga dokument', emptyText: 'Dra en PDF från datorn hit.' })];
    case 'history':
      return h('div', { class: 'card' }, h('div', { class: 'card-body' }, c.history.length ? h('ol', { class: 'timeline big' }, c.history.map((x) => h('li', { class: 'clickable', onclick: () => x.ref && get(x.ref) && app.select(x.ref) }, h('i', { class: `tl-dot k-${x.kind}` }), h('div', h('span', x.text), h('small', `${fmtDate(x.ts.slice(0, 10))} · ${ago(x.ts)}`))))) : h('p', { class: 'muted pad' }, 'Ingen historik.')));
  }
  return null;
}

function miniRow(x, right) {
  const el = h('div', { class: 'list-row', tabindex: '0', dataset: { nav: '1' } }, h('b', { class: 'mono' }, codeOf(x.ref, x.e)), h('span', { class: 'lr-title' }, titleOf(x.ref, x.e).replace(codeOf(x.ref, x.e), '').trim()), right);
  return bindEntity(el, x.ref);
}

export function photoTile(x) {
  const tile = h('figure', { class: 'photo', style: { '--h': x.e.hue ?? hueOf(x.e.name) }, tabindex: '0' },
    h('div', { class: 'photo-img' }, icon('image', 22)), h('figcaption', h('b', x.e.subject || x.e.name), h('small', fmtDate(x.e.date))));
  if (x.e.file) fileUrl(x.e.file).then((u) => { if (u) { const img = tile.querySelector('.photo-img'); img.style.backgroundImage = `url("${u}")`; img.classList.add('has-img'); img.replaceChildren(); } });
  return bindEntity(tile, x.ref);
}

export function modelCard(x) {
  const v = latestVersion(x.e);
  const card = h('article', { class: 'model-card', tabindex: '0' },
    h('div', { class: 'mc-icon' }, icon('cube', 22)),
    h('div', { class: 'grow' }, h('b', x.e.name), h('small', `${x.e.discipline} · ${x.e.versions.length} versioner`)),
    h('div', { class: 'mc-ver' }, h('span', { class: 'mono' }, `v${v?.v ?? '–'}`), h('small', v ? fmtDate(v.date) : '')));
  return bindEntity(card, x.ref);
}
