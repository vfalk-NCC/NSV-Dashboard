import { store, init, on, get, all, TYPES, labelOf, codeOf, titleOf, refKey, parseKey, sameRef, undo, canUndo, resetToSeed, clearAll, persist, emit, parseDate, today, statusOf } from './store.js';
import { h, icon, typeIcon, toast, preserve, closeTopOverlay, hasOverlay, contextMenu, modal, confirmDialog, dropTarget, readDropped, kbd, $, $$, popover, skeleton } from './ui.js';
import { app, layout, saveLayout } from './app.js';
import { renderContext } from './context.js';
import { openPalette, pushRecent } from './palette.js';
import { onFilters, filters, activeCount, applyFilter, describe } from './filters.js';
import { createIssue, createAction, createDecision, createMeeting, editEntity, deleteEntity, addToWhiteboard, isFav, toggleFav, entityMenu } from './actions.js';
import * as overview from './views/overview.js';
import * as schedule from './views/schedule.js';
import * as packages from './views/packages.js';
import * as issues from './views/issues.js';
import * as actionsView from './views/actions.js';
import * as library from './views/library.js';
import * as whiteboard from './views/whiteboard.js';
import * as tools from './views/tools.js';
import { syncButton, initSync, runSync, manageSources } from './sync.js';

const VIEWS = { overview, schedule, packages, issues, actions: actionsView, library, whiteboard, tools };
const NAV = [
  { id: 'overview', label: 'Översikt', icon: 'home', key: 'o' },
  { id: 'schedule', label: 'Tidplan', icon: 'gantt', key: 's' },
  { id: 'packages', label: 'Arbetspaket', icon: 'box', key: 'p' },
  { id: 'issues', label: 'Ärenden', icon: 'alert', key: 'i', count: () => all('issue').filter((i) => ['open', 'inprogress'].includes(i.status)).length },
  { id: 'actions', label: 'Åtgärder', icon: 'kanban', key: 'a', count: () => all('action').filter((a) => a.status !== 'done').length, warn: () => all('action').some((a) => a.status !== 'done' && parseDate(a.due) < today()) },
  { id: 'library', label: 'Ritningar & modeller', icon: 'layers', key: 'r' },
  { id: 'whiteboard', label: 'Whiteboard', icon: 'board', key: 'w' }
];

const shell = {};

// ------------------------------------------------------------------ skal
function buildShell() {
  document.documentElement.dataset.theme = layout.theme;
  const root = $('#app');
  shell.nav = h('nav', { class: 'nav', 'aria-label': 'Huvudnavigering' });
  shell.view = h('main', { class: 'main', id: 'view', tabindex: '-1' });
  shell.ctx = h('aside', { class: 'ctxpanel', 'aria-label': 'Kontextpanel' });
  shell.crumbs = h('div', { class: 'crumbs' });
  shell.save = h('span', { class: 'savestate' });
  shell.floats = h('div', { class: 'floats' });
  const navResizer = h('div', { class: 'resizer r-nav', title: 'Dra för att ändra bredd' });
  const ctxResizer = h('div', { class: 'resizer r-ctx', title: 'Dra för att ändra bredd · dubbelklick återställer' });

  const top = h('header', { class: 'topbar' },
    h('button', { class: 'iconbtn', title: 'Visa/dölj navigering ([)', onclick: () => app.toggleNav() }, icon('sidebar', 17)),
    h('a', { class: 'brand', href: '#/overview' }, h('span', { class: 'brand-mark' }, h('i'), h('i'), h('i')), h('span', { class: 'brand-name' }, 'Project Control Hub')),
    shell.crumbs,
    h('span', { class: 'grow' }),
    h('button', { class: 'searchbtn', onclick: () => openPalette(), title: 'Sök och kommandon (Ctrl+K)' }, icon('search', 15), h('span', 'Sök eller kör kommando…'), kbd('Ctrl', 'K')),
    syncButton(),
    h('button', { class: 'btn sm primary create-btn', title: 'Skapa ny', onclick: (e) => createMenu(e.currentTarget) }, icon('plus', 14), 'Ny'),
    shell.save,
    h('button', { class: 'iconbtn', title: 'Tema', onclick: () => app.toggleTheme() }, icon(layout.theme === 'dark' ? 'sun' : 'moon', 17)),
    h('button', { class: 'iconbtn', title: 'Visa/dölj kontextpanel (])', onclick: () => app.toggleCtx() }, icon('panelR', 17)));

  root.replaceChildren(top, h('div', { class: 'workspace' }, shell.nav, navResizer, shell.view, ctxResizer, shell.ctx), shell.floats);
  applyLayout();
  resizer(navResizer, (dx, w0) => { layout.navW = Math.max(180, Math.min(360, w0 + dx)); applyLayout(); }, () => layout.navW, () => { layout.navW = 232; applyLayout(); });
  resizer(ctxResizer, (dx, w0) => { layout.ctxW = Math.max(300, Math.min(720, w0 - dx)); applyLayout(); }, () => layout.ctxW, () => { layout.ctxW = 380; applyLayout(); });
}

function resizer(el, onMove, getW, reset) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const x0 = e.clientX, w0 = getW();
    el.setPointerCapture(e.pointerId);
    document.body.classList.add('resizing');
    const move = (ev) => onMove(ev.clientX - x0, w0);
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); document.body.classList.remove('resizing'); saveLayout(); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', up);
  });
  el.addEventListener('dblclick', () => { reset(); saveLayout(); });
}

function applyLayout() {
  const ws = $('.workspace');
  ws.style.setProperty('--nav-w', (layout.nav ? layout.navW : 60) + 'px');
  ws.style.setProperty('--ctx-w', layout.ctxW + 'px');
  ws.classList.toggle('nav-rail', !layout.nav);
  ws.classList.toggle('ctx-hidden', !layout.ctx);
}

app.toggleNav = () => { layout.nav = !layout.nav; applyLayout(); saveLayout(); renderNav(); };
app.toggleCtx = () => { layout.ctx = !layout.ctx; applyLayout(); saveLayout(); };
app.toggleTheme = () => {
  layout.theme = layout.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = layout.theme;
  saveLayout(); buildTopIcons();
};
function buildTopIcons() { const b = $('.topbar .iconbtn[title="Tema"]'); if (b) b.replaceChildren(icon(layout.theme === 'dark' ? 'sun' : 'moon', 17)); }

function createMenu(anchor) {
  const r = anchor.getBoundingClientRect();
  const sel = app.selection && get(app.selection) ? app.selection : null;
  const pkgId = sel?.t === 'package' ? sel.id : get(sel || {})?.packageId;
  contextMenu(r.left, r.bottom + 6, [
    { header: sel ? `Kopplat till ${codeOf(sel) || titleOf(sel)}` : 'Skapa' },
    { label: 'Åtgärd', icon: 'check', kbd: 'N', action: () => createAction({ packageId: pkgId, linkTo: sel && sel.t !== 'package' ? sel : null }) },
    { label: 'Ärende', icon: 'alert', kbd: 'I', action: () => createIssue({ packageId: pkgId, linkTo: sel && sel.t !== 'package' ? sel : null }) },
    { label: 'Beslut', icon: 'gavel', action: () => createDecision({ packageId: pkgId, linkTo: sel }) },
    { label: 'Möte', icon: 'users', action: () => createMeeting({ packageId: pkgId, linkTo: sel }) },
    { divider: true },
    { label: 'Verktyg i My Tools', icon: 'tool', action: () => { app.navigate('#/tools'); tools.addToolDialog(); } }
  ]);
}

// ------------------------------------------------------------------ navigering
function renderNav() {
  const cur = app.route.view === 'package' ? 'packages' : app.route.view === 'tool' ? 'tools' : app.route.view;
  const item = (n) => {
    const c = n.count?.();
    const a = h('a', { class: `nav-item ${cur === n.id ? 'on' : ''}`, href: `#/${n.id}`, title: `${n.label}${n.key ? ` (G ${n.key.toUpperCase()})` : ''}` },
      icon(n.icon, 17), h('span', { class: 'nav-label' }, n.label), c ? h('em', { class: n.warn?.() ? 'warn' : '' }, c) : null);
    if (n.id === 'whiteboard') dropTarget(a, { accept: (s) => s.ref && s.ref.t !== 'tool', label: (s) => `Lägg ${codeOf(s.ref) || titleOf(s.ref)} på whiteboard`, onDrop: (s) => addToWhiteboard(s.ref) });
    return a;
  };
  const favs = (store.db.favourites || []).map(parseKey).filter((r) => get(r)).slice(0, 8);
  const favTools = store.db.tools.filter((t) => t.favourite).slice(0, 6);
  const saved = store.db.savedFilters.filter((s) => s.fav);
  const toolsItem = h('a', { class: `nav-item ${cur === 'tools' ? 'on' : ''}`, href: '#/tools', title: 'My Tools (G T)' }, icon('tool', 17), h('span', { class: 'nav-label' }, 'My Tools'), h('em', store.db.tools.length));
  dropTarget(toolsItem, { accept: (s) => !!s.files, label: () => 'Lägg till som verktyg', onDrop: async (s) => { const f = await readDropped(s); app.navigate('#/tools'); tools.addToolDialog(f); } });

  const p = store.db.project;
  preserve(shell.nav, () => shell.nav.replaceChildren(
    h('div', { class: 'nav-project' }, h('span', { class: 'proj-badge' }, p.name.slice(0, 3)), h('div', { class: 'nav-label' }, h('b', p.name), h('small', store.db.demo ? 'Exempeldata' : p.phase || ''))),
    h('div', { class: 'nav-sec', dataset: { skey: 'nav' } },
      h('div', { class: 'nav-head' }, 'Projekt'), NAV.map(item),
      h('div', { class: 'nav-head' }, 'Verktyg'), toolsItem,
      favTools.map((t) => h('a', { class: `nav-item sub ${app.route.view === 'tool' && app.route.params[0] === t.id ? 'on' : ''}`, href: `#/tool/${encodeURIComponent(t.id)}`, title: t.name }, h('span', { class: 'nav-glyph' }, t.icon || t.name[0]), h('span', { class: 'nav-label' }, t.name))),
      favs.length ? [h('div', { class: 'nav-head' }, 'Favoriter'), favs.map((r) => {
        const a = h('a', { class: `nav-item sub ${sameRef(app.selection, r) ? 'on' : ''}`, href: '#', title: labelOf(r), onclick: (e) => { e.preventDefault(); r.t === 'package' ? app.open(r) : app.select(r, { reveal: true }); } },
          typeIcon(r.t, 14), h('span', { class: 'nav-label' }, h('b', { class: 'mono' }, codeOf(r)), ' ', titleOf(r).replace(codeOf(r), '').trim()));
        a.addEventListener('contextmenu', (e) => { e.preventDefault(); contextMenu(e.clientX, e.clientY, entityMenu(r)); });
        return a;
      })] : null,
      saved.length ? [h('div', { class: 'nav-head' }, 'Sparade filter'), saved.map((s) => h('a', { class: 'nav-item sub', href: '#', title: describe(s.filter), onclick: (e) => { e.preventDefault(); applyFilter(s.filter); toast(`Filter: ${s.name}`, { iconName: 'filter' }); } }, icon('filter', 14), h('span', { class: 'nav-label' }, s.name)))] : null),
    h('div', { class: 'nav-foot' },
      h('button', { class: `mode-pill ${store.mode}`, onclick: () => app.settings(), title: 'Inställningar och data' },
        h('i'), h('span', { class: 'nav-label' }, store.mode === 'server' ? 'Lokal server' : 'Demoläge'), icon('server', 14)),
      h('button', { class: 'iconbtn', title: 'Kortkommandon (?)', onclick: () => app.shortcuts() }, icon('keyboard', 16)))));
}

// ------------------------------------------------------------------ routing
function parseRoute() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'overview').split('/').map(decodeURIComponent);
  return { view: parts[0], params: parts.slice(1) };
}

let lastView = null;
function onRoute() {
  const r = parseRoute();
  if (r.view === 'item') {
    const ref = { t: r.params[0], id: r.params[1] };
    history.replaceState(null, '', '#/overview');
    app.route = { view: 'overview', params: [] };
    render();
    if (get(ref)) app.open(ref);
    return;
  }
  const prev = app.route;
  app.route = r;
  // Byte av flik inom samma arbetspaket: rendera bara flikinnehållet
  if (prev.view === 'package' && r.view === 'package' && prev.params[0] === r.params[0] && lastView === 'package') {
    packages.switchTab(shell.view, r.params[0], r.params[1] || 'overview');
    renderCrumbs();
    return;
  }
  render({ animate: true });
}

let renderQueued = false;
app.render = () => {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; render(); });
};

function render({ animate = false } = {}) {
  const r = app.route;
  const el = shell.view;
  const key = `${r.view}/${r.params.join('/')}`;
  const changedView = lastView !== key;
  preserve(el, () => {
    if (r.view === 'package') packages.renderPackage(el, r.params[0], r.params[1] || 'overview');
    else if (r.view === 'tool') {
      if (changedView) tools.renderWorkspace(el, r.params[0]); else tools.updateWorkspace();
    } else if (r.view === 'library') library.render(el, { tab: r.params[0] });
    else (VIEWS[r.view] || overview).render(el);
  });
  if (animate && changedView) { el.classList.remove('view-enter'); void el.offsetWidth; el.classList.add('view-enter'); el.scrollTop = 0; }
  lastView = key;
  document.body.dataset.view = r.view;
  renderNav();
  renderCrumbs();
  markSelection();
}

function renderCrumbs() {
  const r = app.route;
  const p = store.db.project;
  const c = [h('a', { href: '#/overview' }, p.name)];
  const sep = () => h('span', { class: 'sep' }, icon('chevR', 12));
  if (r.view === 'package') {
    const pk = get({ t: 'package', id: r.params[0] });
    const ar = pk && get({ t: 'area', id: pk.areaId });
    c.push(sep(), h('a', { href: '#/packages' }, 'Arbetspaket'));
    if (ar) c.push(sep(), h('a', { href: '#', onclick: (e) => { e.preventDefault(); applyFilter({ area: [ar.id] }); app.navigate('#/packages'); } }, `Område ${ar.code}`));
    if (pk) c.push(sep(), h('b', pk.name));
  } else if (r.view === 'tool') {
    const t = store.db.tools.find((x) => x.id === r.params[0]);
    c.push(sep(), h('a', { href: '#/tools' }, 'My Tools'), sep(), h('b', t?.name || 'Verktyg'));
  } else {
    const v = NAV.find((n) => n.id === r.view) || (r.view === 'tools' ? { label: 'My Tools' } : NAV[0]);
    c.push(sep(), h('b', v.label));
  }
  const n = activeCount();
  if (n && !['tool', 'tools', 'whiteboard'].includes(r.view)) c.push(h('button', { class: 'crumb-filter', title: describe(filters.cur), onclick: () => import('./filters.js').then((m) => m.clearFilters()) }, icon('filter', 12), `${n} filter`, icon('x', 11)));
  shell.crumbs.replaceChildren(...c);
}

// ------------------------------------------------------------------ urval & kontext
app.select = (ref, opts = {}) => {
  if (ref && layout.pinned && !sameRef(ref, parseKey(layout.pinned)) && !opts.force) { app.openFloat(ref); return; }
  app.selection = ref;
  if (ref) pushRecent(ref);
  if (ref && (opts.reveal || !layout.ctx) && innerWidth > 900) { if (!layout.ctx) { layout.ctx = true; applyLayout(); saveLayout(); } }
  renderCtx(opts);
  markSelection();
  if (ref && innerWidth <= 900) shell.ctx.classList.add('mobile-open');
};

app.open = (ref) => {
  const e = get(ref);
  if (!e) return;
  pushRecent(ref);
  const pk = e.packageId;
  const go = (hash) => { if (location.hash !== hash) app.navigate(hash); };
  switch (ref.t) {
    case 'package': go(`#/package/${ref.id}/overview`); app.select(ref, { force: true }); return;
    case 'tool': go(`#/tool/${encodeURIComponent(ref.id)}`); return;
    case 'area': applyFilter({ area: [ref.id] }); go('#/packages'); app.select(ref, { force: true }); return;
    case 'activity': go(pk ? `#/package/${pk}/schedule` : '#/schedule'); break;
    case 'issue': go(pk ? `#/package/${pk}/issues` : '#/issues'); break;
    case 'action': go(pk ? `#/package/${pk}/actions` : '#/actions'); break;
    case 'decision': if (pk) go(`#/package/${pk}/decisions`); break;
    case 'meeting': if (pk) go(`#/package/${pk}/meetings`); break;
    case 'document': if (pk) go(`#/package/${pk}/${e.kind === 'email' ? 'emails' : e.kind === 'photo' ? 'photos' : 'documents'}`); break;
    case 'drawing': go('#/library/drawings'); break;
    case 'model': go('#/library/models'); break;
  }
  app.select(ref, { reveal: true, force: true });
};

function markSelection() {
  const k = app.selection ? refKey(app.selection) : null;
  $$('.selected[data-ref]').forEach((e) => { if (e.dataset.ref !== k) e.classList.remove('selected'); });
  if (k) $$(`[data-ref="${CSS.escape(k)}"]`).forEach((e) => { if (!e.closest('.ctxpanel, .float')) e.classList.add('selected'); });
}

function renderCtx(opts = {}) {
  const ref = layout.pinned ? parseKey(layout.pinned) : app.selection;
  const pinned = !!layout.pinned;
  const head = h('div', { class: 'ctxpanel-head' },
    h('span', { class: 'ctxpanel-title' }, pinned ? h('span', { class: 'pin-ind' }, icon('pin', 12), 'Fäst') : 'Kontext'),
    h('span', { class: 'grow' }),
    ref && h('button', { class: `iconbtn sm ${pinned ? 'on' : ''}`, title: pinned ? 'Lossa – nya val visas här igen' : 'Fäst – nya val öppnas i flytande fönster', onclick: () => { layout.pinned = pinned ? null : refKey(ref); saveLayout(); renderCtx(); toast(pinned ? 'Kontextpanelen lossad' : 'Kontextpanelen fäst. Nya val öppnas i flytande fönster.', { iconName: 'pin' }); } }, icon('pin', 14)),
    ref && h('button', { class: 'iconbtn sm', title: 'Öppna i flytande fönster', onclick: () => app.openFloat(ref) }, icon('window', 14)),
    h('button', { class: 'iconbtn sm', title: 'Stäng panelen (])', onclick: () => { if (innerWidth <= 900) shell.ctx.classList.remove('mobile-open'); else app.toggleCtx(); } }, icon('x', 14)));
  const content = ref && get(ref) ? renderContext(ref, { focus: opts.tab }) : ctxEmpty();
  preserve(shell.ctx, () => shell.ctx.replaceChildren(head, content));
  if (opts.tab || opts.animate !== false) { content.classList?.add('ctx-enter'); }
}

function ctxEmpty() {
  return h('div', { class: 'ctx-empty' },
    h('div', { class: 'ctx-empty-art' }, icon('target', 26)),
    h('b', 'Inget valt'),
    h('p', 'Klicka på ett paket, en aktivitet, en ritning eller ett ärende för att se detaljer och kopplingar här.'),
    h('ul', { class: 'tips' },
      h('li', kbd('Ctrl', 'K'), ' sök överallt'),
      h('li', kbd('⇧', 'Klick'), ' öppna i flytande fönster'),
      h('li', kbd('Högerklick'), ' snabbval'),
      h('li', kbd('J'), kbd('K'), ' bläddra i listor'),
      h('li', 'Dra information mellan listor för att koppla')));
}

// ------------------------------------------------------------------ flytande fönster
app.openFloat = (ref) => {
  const k = refKey(ref);
  const existing = layout.floats.find((f) => f.key === k);
  if (existing) { existing.min = false; existing.z = Date.now(); }
  else {
    const n = layout.floats.length;
    layout.floats.push({ key: k, x: Math.max(80, innerWidth - layout.ctxW - 420 - n * 28), y: Math.max(70, innerHeight - 520 + n * 28), w: 400, h: 460, z: Date.now() });
    if (layout.floats.length > 5) layout.floats.shift();
  }
  saveLayout(); renderFloats(k);
};

function renderFloats(focusKey) {
  layout.floats = layout.floats.filter((f) => get(parseKey(f.key)));
  const els = layout.floats.map((f) => {
    const ref = parseKey(f.key);
    const el = h('div', { class: `float ${f.min ? 'min' : ''} ${f.key === focusKey ? 'float-enter' : ''}`, style: { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.min ? '' : f.h + 'px', zIndex: 40 + (layout.floats.indexOf(f)) }, dataset: { fkey: 'float-' + f.key } },
      h('div', { class: 'float-head' },
        typeIcon(ref.t, 13), h('b', { class: 'mono' }, codeOf(ref)), h('span', { class: 'float-title' }, titleOf(ref).replace(codeOf(ref), '').trim()),
        h('span', { class: 'grow' }),
        h('button', { class: 'iconbtn xs', title: 'Visa i kontextpanelen', onclick: () => { closeFloat(f); layout.pinned = null; app.select(ref, { reveal: true, force: true }); } }, icon('panelR', 13)),
        h('button', { class: 'iconbtn xs', title: f.min ? 'Expandera' : 'Minimera', onclick: () => { f.min = !f.min; saveLayout(); renderFloats(); } }, icon(f.min ? 'chevU' : 'minus', 13)),
        h('button', { class: 'iconbtn xs', title: 'Stäng', onclick: () => closeFloat(f) }, icon('x', 13))),
      !f.min && h('div', { class: 'float-body' }, renderContext(ref, { float: true })));
    // flytta
    const head = el.querySelector('.float-head');
    head.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      const s = { x: e.clientX, y: e.clientY, fx: f.x, fy: f.y };
      head.setPointerCapture(e.pointerId);
      layout.floats.push(layout.floats.splice(layout.floats.indexOf(f), 1)[0]);
      $$('.float', shell.floats).forEach((x, i) => (x.style.zIndex = 40 + i));
      el.style.zIndex = 60;
      const move = (ev) => { f.x = Math.max(0, Math.min(innerWidth - 120, s.fx + ev.clientX - s.x)); f.y = Math.max(48, Math.min(innerHeight - 40, s.fy + ev.clientY - s.y)); el.style.left = f.x + 'px'; el.style.top = f.y + 'px'; };
      const up = () => { head.removeEventListener('pointermove', move); head.removeEventListener('pointerup', up); saveLayout(); };
      head.addEventListener('pointermove', move); head.addEventListener('pointerup', up);
    });
    head.addEventListener('dblclick', () => { f.min = !f.min; saveLayout(); renderFloats(); });
    // storlek (CSS resize) – spara
    new ResizeObserver(() => { if (!f.min && el.offsetWidth > 100) { f.w = el.offsetWidth; f.h = el.offsetHeight; saveLayoutSoon(); } }).observe(el);
    return el;
  });
  preserve(shell.floats, () => shell.floats.replaceChildren(...els));
}
let slT; const saveLayoutSoon = () => { clearTimeout(slT); slT = setTimeout(saveLayout, 300); };
function closeFloat(f) { layout.floats = layout.floats.filter((x) => x !== f); saveLayout(); renderFloats(); }

// ------------------------------------------------------------------ tangentbord
let gPending = 0;
function typing(e) { const t = e.target; return t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName); }

function onKey(e) {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openPalette(); return; }
  if (mod && e.key === 'z' && !typing(e)) { e.preventDefault(); const l = undo(); if (l) toast(`Ångrade: ${l}`); return; }
  if (e.key === 'Escape') {
    if (closeTopOverlay()) { e.preventDefault(); return; }
    if (typing(e)) { e.target.blur(); return; }
    if (shell.ctx.classList.contains('mobile-open')) { shell.ctx.classList.remove('mobile-open'); return; }
    if (app.selection) { app.selection = null; renderCtx(); markSelection(); }
    return;
  }
  if (typing(e) || hasOverlay() || mod || e.altKey && e.key !== 'ArrowLeft') {
    if (e.altKey && e.key === 'ArrowLeft' && !typing(e)) { history.back(); e.preventDefault(); }
    return;
  }
  const k = e.key;
  if (Date.now() - gPending < 900) {
    gPending = 0;
    const map = { o: 'overview', s: 'schedule', p: 'packages', i: 'issues', a: 'actions', r: 'library', w: 'whiteboard', t: 'tools' };
    if (map[k.toLowerCase()]) { app.navigate(`#/${map[k.toLowerCase()]}`); e.preventDefault(); }
    return;
  }
  // vy-specifika tangenter först
  const v = app.route.view;
  if (v === 'schedule' && schedule.keys(e)) { e.preventDefault(); return; }
  if (v === 'whiteboard' && whiteboard.keys(e, shell.view)) { e.preventDefault(); return; }
  if (v === 'tool' && tools.workspaceKeys(e)) { e.preventDefault(); return; }
  if (v === 'package' && /^[1-9]$/.test(k)) {
    const tabs = $$('.tabs .tab', shell.view); const t = tabs[+k - 1];
    if (t) { location.hash = t.getAttribute('href'); e.preventDefault(); }
    return;
  }
  switch (k) {
    case 'g': case 'G': gPending = Date.now(); break;
    case '/': e.preventDefault(); openPalette(); break;
    case '?': app.shortcuts(); break;
    case 'u': case 'U': e.preventDefault(); runSync(); break;
    case '[': app.toggleNav(); break;
    case ']': app.toggleCtx(); break;
    case 'n': case 'N': e.preventDefault(); createAction(selDefaults()); break;
    case 'i': case 'I': e.preventDefault(); createIssue(selDefaults()); break;
    case 'e': case 'E': if (app.selection) { e.preventDefault(); editEntity(app.selection); } break;
    case 'w': case 'W': if (app.selection) addToWhiteboard(app.selection); break;
    case 's': case 'S': if (app.selection) toggleFav(app.selection); break;
    case 'Delete': case 'Backspace': if (app.selection) { e.preventDefault(); deleteEntity(app.selection); } break;
    case 'Enter': if (app.selection) { const f = document.activeElement; if (!f?.closest('button, a')) { e.preventDefault(); app.open(app.selection); } } break;
    case 'j': case 'ArrowDown': moveSel(1, e); break;
    case 'k': case 'ArrowUp': moveSel(-1, e); break;
  }
}
function selDefaults() {
  const s = app.selection; const e = s && get(s);
  if (!e) return { packageId: app.route.view === 'package' ? app.route.params[0] : undefined };
  return { packageId: s.t === 'package' ? e.id : e.packageId, linkTo: s.t !== 'package' ? s : null };
}
function moveSel(dir, e) {
  const rows = $$('[data-nav][data-ref]', shell.view).filter((r) => r.offsetParent);
  if (!rows.length) return;
  e.preventDefault();
  const k = app.selection ? refKey(app.selection) : null;
  let i = rows.findIndex((r) => r.dataset.ref === k);
  i = i < 0 ? (dir > 0 ? 0 : rows.length - 1) : Math.max(0, Math.min(rows.length - 1, i + dir));
  const row = rows[i];
  row.focus({ preventScroll: true });
  row.scrollIntoView({ block: 'nearest' });
  app.select(parseKey(row.dataset.ref));
}

app.shortcuts = () => {
  const g = (title, rows) => h('div', { class: 'sc-group' }, h('h4', title), rows.map(([keys, label]) => h('div', { class: 'sc-row' }, h('span', label), kbd(...keys))));
  modal({
    title: 'Kortkommandon', width: 720, cls: 'modal-shortcuts',
    body: h('div', { class: 'sc-grid' },
      g('Allmänt', [[['Ctrl', 'K'], 'Sök och kommandon'], [['/'], 'Sök'], [['?'], 'Den här listan'], [['Esc'], 'Stäng / avmarkera'], [['Ctrl', 'Z'], 'Ångra senaste'], [['U'], 'Hämta uppdateringar'], [['['], 'Navigering'], [[']'], 'Kontextpanel'], [['Alt', '←'], 'Tillbaka']]),
      g('Gå till', [[['G', 'O'], 'Översikt'], [['G', 'S'], 'Tidplan'], [['G', 'P'], 'Arbetspaket'], [['G', 'I'], 'Ärenden'], [['G', 'A'], 'Åtgärder'], [['G', 'R'], 'Ritningar & modeller'], [['G', 'W'], 'Whiteboard'], [['G', 'T'], 'My Tools']]),
      g('Markerat objekt', [[['J'], 'Nästa i listan'], [['K'], 'Föregående'], [['↵'], 'Öppna'], [['E'], 'Redigera'], [['S'], 'Favorit'], [['W'], 'Till whiteboard'], [['Del'], 'Ta bort'], [['⇧', 'Klick'], 'Flytande fönster']]),
      g('Skapa & vyer', [[['N'], 'Ny åtgärd'], [['I'], 'Nytt ärende'], [['1–9'], 'Flikar i arbetspaket'], [['←', '→'], 'Tidplan: bläddra'], [['T'], 'Tidplan: idag'], [['F'], 'Whiteboard: anpassa'], [['R'], 'Verktyg: ladda om'], [['I'], 'Verktyg: info']]))
  });
};

app.settings = () => {
  const s = store.server;
  const fileIn = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const db = JSON.parse(await f.text());
      if (!db.version) throw new Error('Filen ser inte ut som en Project Control Hub-export');
      if (!(await confirmDialog({ title: 'Importera data?', text: `All nuvarande data ersätts med innehållet i ${f.name}. Du kan ångra direkt efteråt.`, okLabel: 'Importera', danger: true }))) return;
      import('./store.js').then((m) => m.mutate('Data importerad', () => { m.store.db = db; }, { kind: 'reset' }));
      toast('Data importerad', { tone: 'ok' });
    } catch (err) { toast(err.message, { tone: 'bad' }); }
  } });
  const m = modal({
    title: 'Inställningar och data', width: 600,
    body: h('div', { class: 'settings' },
      h('div', { class: `mode-card ${store.mode}` }, icon('server', 20), h('div',
        h('b', store.mode === 'server' ? 'Lokal server körs' : 'Demoläge i webbläsaren'),
        h('p', { class: 'muted small' }, store.mode === 'server'
          ? `Data sparas i ${s.paths.data}/db.json. Verktyg ligger i ${s.paths.tools}/ och körs från ${s.toolOrigin}. Tool API: ${s.toolApi ? 'på (läsning)' : 'av'}.`
          : 'Data sparas bara i den här webbläsaren. Starta start.bat för riktig databas, bilagor på disk och verktyg i mappar.'))),
      h('div', { class: 'set-row' }, h('div', h('b', 'Datakällor'), h('small', 'SharePoint (synkad mapp), mappar, Powerproject-tidplan och skript som NSV Binder.')),
        h('button', { class: 'btn sm', onclick: () => { m.close(); manageSources(); } }, icon('server', 13), 'Hantera…')),
      h('div', { class: 'set-row' }, h('div', h('b', 'Tema'), h('small', 'Mörkt passar kontrollrumskänslan, ljust för utskrift och dagsljus.')),
        h('div', { class: 'seg' }, ['dark', 'light'].map((t) => h('button', { class: layout.theme === t ? 'on' : '', onclick: (e) => { if (layout.theme !== t) app.toggleTheme(); e.currentTarget.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === e.currentTarget)); } }, t === 'dark' ? 'Mörkt' : 'Ljust')))),
      h('div', { class: 'set-row' }, h('div', h('b', 'Arbetsyta'), h('small', 'Panelbredder, flytande fönster och fästning sparas lokalt.')),
        h('button', { class: 'btn sm', onclick: () => { localStorage.removeItem('pch.layout.v1'); location.reload(); } }, 'Återställ layout')),
      h('div', { class: 'set-row' }, h('div', h('b', 'Exportera'), h('small', 'Hela databasen som JSON (utan bilagornas filer).')),
        h('button', { class: 'btn sm', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(store.db, null, 2)], { type: 'application/json' })), download: `project-control-hub-${new Date().toISOString().slice(0, 10)}.json` }); a.click(); } }, icon('save', 13), 'Exportera')),
      h('div', { class: 'set-row' }, h('div', h('b', 'Importera'), h('small', 'Ersätt data med en tidigare export.')), h('button', { class: 'btn sm', onclick: () => fileIn.click() }, icon('upload', 13), 'Importera…'), fileIn),
      h('div', { class: 'set-row' }, h('div', h('b', 'Exempeldata'), h('small', store.db.demo ? 'Du tittar på exempeldata för NSV.' : 'Läs in exempelprojektet igen.')),
        h('button', { class: 'btn sm', onclick: async () => { if (await confirmDialog({ title: 'Återställ exempeldata?', text: 'All projektdata ersätts med exempeldatan.', okLabel: 'Återställ', danger: true })) { resetToSeed(); m.close(); toast('Exempeldata återställd', { action: { label: 'Ångra', fn: () => undo() } }); } } }, 'Återställ')),
      h('div', { class: 'set-row danger' }, h('div', h('b', 'Börja från noll'), h('small', 'Tömmer all projektdata. Dina verktyg i My Tools behålls.')),
        h('button', { class: 'btn sm danger', onclick: async () => { if (await confirmDialog({ title: 'Töm all projektdata?', text: 'Alla områden, paket, aktiviteter, ritningar, ärenden m.m. tas bort. Du kan ångra direkt efteråt.', okLabel: 'Töm', danger: true })) { clearAll(); store.db.demo = false; persist(); m.close(); toast('All projektdata tömd', { action: { label: 'Ångra', fn: () => undo() } }); } } }, 'Töm data')))
  });
};

function renderSave(state) {
  shell.save.className = `savestate s-${state}`;
  shell.save.title = { saved: store.mode === 'server' ? 'Sparat i data/db.json' : 'Sparat i webbläsaren', saving: 'Sparar…', error: 'Kunde inte spara!' }[state];
  shell.save.replaceChildren(h('i'), h('span', { saved: 'Sparat', saving: 'Sparar…', error: 'Fel vid sparning' }[state]));
}

// ------------------------------------------------------------------ start
async function start() {
  $('#app').replaceChildren(h('div', { class: 'boot' }, h('span', { class: 'brand-mark big' }, h('i'), h('i'), h('i')), skeleton(4)));
  const { fresh } = await init();
  buildShell();
  renderSave(store.saveState);
  on('save', renderSave);
  on('change', () => { app.render(); renderCtxSoon(); renderFloatsSoon(); });
  onFilters(() => app.render());
  addEventListener('hashchange', onRoute);
  addEventListener('keydown', onKey);
  // stäng popovers vid scroll i huvudytan
  shell.view.addEventListener('scroll', () => { if ($('.popover.open:not(.pop-menu)')) {} }, { passive: true });
  onRoute();
  initSync();
  renderCtx();
  renderFloats();
  if (fresh) setTimeout(() => toast(store.mode === 'server' ? 'Välkommen! Exempeldata för NSV är inläst. Ctrl+K för att söka.' : 'Demoläge: data sparas i webbläsaren. Starta start.bat för full funktion.', { timeout: 7000, iconName: 'sparkle' }), 400);
}
let cT, fT;
function renderCtxSoon() { cancelAnimationFrame(cT); cT = requestAnimationFrame(() => renderCtx({ animate: false })); }
function renderFloatsSoon() { cancelAnimationFrame(fT); fT = requestAnimationFrame(() => renderFloats()); }

start().catch((e) => {
  console.error(e);
  $('#app').replaceChildren(h('div', { class: 'boot-error' }, h('b', 'Appen kunde inte starta'), h('pre', String(e.stack || e))));
});
