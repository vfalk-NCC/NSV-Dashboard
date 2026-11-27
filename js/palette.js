// Kommandopalett (Ctrl+K): sök i all information och kör kommandon.
import { store, TYPES, all, get, codeOf, titleOf, statusOf, STATUS, latestVersion, refKey, areaOf } from './store.js';
import { h, icon, typeIcon, norm, pushOverlay, $, $$, kbd } from './ui.js';
import { app, layout } from './app.js';
import { createIssue, createAction, createDecision, createMeeting, addToWhiteboard, linkPicker, toggleFav } from './actions.js';
import { setFilter, clearFilters, saveCurrent, applyFilter } from './filters.js';

const RECENT_KEY = 'pch.recentItems';
export function pushRecent(ref) {
  try {
    const l = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter((k) => k !== refKey(ref));
    l.unshift(refKey(ref));
    localStorage.setItem(RECENT_KEY, JSON.stringify(l.slice(0, 12)));
  } catch {}
}
function recentRefs() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').map((k) => { const i = k.indexOf(':'); return { t: k.slice(0, i), id: k.slice(i + 1) }; }).filter((r) => get(r)); } catch { return []; }
}

function commands() {
  const go = (hash) => () => app.navigate(hash);
  const sel = app.selection;
  const list = [
    { id: 'new-action', label: 'Skapa åtgärd', kw: 'new action ny åtgärd skapa task todo', icon: 'plus', kbd: 'N', run: () => createAction() },
    { id: 'new-issue', label: 'Skapa ärende', kw: 'new issue nytt ärende avvikelse kollision', icon: 'alert', kbd: 'I', run: () => createIssue() },
    { id: 'new-decision', label: 'Skapa beslut', kw: 'new decision nytt beslut', icon: 'gavel', run: () => createDecision() },
    { id: 'new-meeting', label: 'Skapa möte', kw: 'new meeting nytt möte', icon: 'users', run: () => createMeeting() },
    { id: 'add-tool', label: 'Lägg till verktyg i My Tools', kw: 'add tool html app verktyg importera', icon: 'tool', run: () => import('./views/tools.js').then((m) => { app.navigate('#/tools'); m.addToolDialog(); }) },
    { id: 'go-overview', label: 'Gå till Översikt', kw: 'go overview dashboard översikt hem', icon: 'home', kbd: 'G O', run: go('#/overview') },
    { id: 'go-schedule', label: 'Gå till Tidplan', kw: 'go schedule gantt tidplan', icon: 'gantt', kbd: 'G S', run: go('#/schedule') },
    { id: 'go-packages', label: 'Gå till Arbetspaket', kw: 'go packages work arbetspaket objekt', icon: 'box', kbd: 'G P', run: go('#/packages') },
    { id: 'go-issues', label: 'Gå till Ärenden', kw: 'go issues ärenden', icon: 'alert', kbd: 'G I', run: go('#/issues') },
    { id: 'go-actions', label: 'Gå till Åtgärder', kw: 'go actions kanban åtgärder', icon: 'kanban', kbd: 'G A', run: go('#/actions') },
    { id: 'go-library', label: 'Gå till Ritningar & modeller', kw: 'go drawings models ritningar modeller bibliotek', icon: 'layers', kbd: 'G R', run: go('#/library') },
    { id: 'go-models', label: 'Gå till Modellkontroll', kw: 'model control ifc import modellkontroll', icon: 'cube', run: go('#/library/models') },
    { id: 'go-whiteboard', label: 'Gå till Whiteboard', kw: 'go whiteboard tavla', icon: 'board', kbd: 'G W', run: go('#/whiteboard') },
    { id: 'go-tools', label: 'Gå till My Tools', kw: 'go tools my tools verktyg launcher', icon: 'tool', kbd: 'G T', run: go('#/tools') },
    { id: 'theme', label: layout.theme === 'dark' ? 'Byt till ljust tema' : 'Byt till mörkt tema', kw: 'theme dark light tema mörkt ljust', icon: layout.theme === 'dark' ? 'sun' : 'moon', run: () => app.toggleTheme() },
    { id: 'nav', label: 'Visa/dölj navigering', kw: 'toggle sidebar navigation meny', icon: 'sidebar', kbd: '[', run: () => app.toggleNav() },
    { id: 'ctx', label: 'Visa/dölj kontextpanel', kw: 'toggle context panel högerpanel', icon: 'panelR', kbd: ']', run: () => app.toggleCtx() },
    { id: 'clear-filters', label: 'Rensa alla filter', kw: 'clear filters rensa filter', icon: 'x', run: () => clearFilters() },
    { id: 'save-filter', label: 'Spara aktuellt filter…', kw: 'save filter spara', icon: 'save', run: () => saveCurrent() },
    { id: 'p-2w', label: 'Period: nästa 2 veckor', kw: 'period next 2 weeks två veckor', icon: 'calendar', run: () => setFilter({ period: '2w' }) },
    { id: 'p-4w', label: 'Period: nästa 4 veckor', kw: 'period next 4 weeks fyra veckor', icon: 'calendar', run: () => setFilter({ period: '4w' }) },
    { id: 'p-overdue', label: 'Visa försenat och förfallet', kw: 'late overdue försenat förfallet', icon: 'clock', run: () => setFilter({ period: 'overdue' }) },
    { id: 'sync', label: 'Hämta uppdateringar', kw: 'sync update hämta uppdateringar sharepoint binder powerproject refresh', icon: 'refresh', kbd: 'U', run: () => import('./sync.js').then((m) => m.runSync()) },
    { id: 'sources', label: 'Datakällor (SharePoint, mappar, Powerproject, skript)…', kw: 'sources datakällor sharepoint powerproject binder skript mapp', icon: 'server', run: () => import('./sync.js').then((m) => m.manageSources()) },
    { id: 'shortcuts', label: 'Visa kortkommandon', kw: 'help shortcuts keyboard kortkommandon hjälp', icon: 'keyboard', kbd: '?', run: () => app.shortcuts() },
    { id: 'settings', label: 'Inställningar och data', kw: 'settings data export import backup inställningar', icon: 'server', run: () => app.settings() }
  ];
  // "open latest structural model" m.fl.
  for (const m of all('model')) {
    const v = latestVersion(m);
    list.push({ id: `latest-${m.id}`, label: `Öppna senaste ${m.name}`, sub: `${m.discipline} · v${v?.v ?? '–'}`, kw: `open latest model senaste modell ${m.discipline} ${m.discipline === 'Konstruktion' ? 'structural k' : ''} ${m.discipline === 'Arkitekt' ? 'architectural a' : ''} ${m.discipline === 'El' ? 'electrical e' : ''} ifc`, icon: 'cube', run: () => app.select({ t: 'model', id: m.id }) });
  }
  for (const s of store.db.savedFilters) list.push({ id: `sf-${s.id}`, label: `Filter: ${s.name}`, kw: `filter sparat ${s.name}`, icon: 'star', run: () => applyFilter(s.filter) });
  for (const t of store.db.tools) list.push({ id: `tool-${t.id}`, label: `Öppna verktyg: ${t.name}`, sub: t.category, kw: `tool verktyg open ${t.name} ${(t.tags || []).join(' ')}`, icon: 'tool', run: () => app.navigate(`#/tool/${encodeURIComponent(t.id)}`) });
  if (sel && get(sel)) {
    list.unshift(
      { id: 'sel-wb', label: `Lägg ${codeOf(sel) || titleOf(sel)} på whiteboard`, kw: 'whiteboard add selection markerad', icon: 'board', run: () => addToWhiteboard(sel), ctx: true },
      { id: 'sel-link', label: `Koppla information till ${codeOf(sel) || titleOf(sel)}…`, kw: 'link connect koppla markerad', icon: 'link', run: () => linkPicker(sel, ['drawing', 'model', 'issue', 'action', 'decision', 'document', 'activity', 'package'].filter((x) => x !== sel.t)), ctx: true },
      { id: 'sel-fav', label: `Favoritmarkera ${codeOf(sel) || titleOf(sel)}`, kw: 'favourite favorit star markerad', icon: 'star', run: () => toggleFav(sel), ctx: true }
    );
  }
  return list;
}

function entityItems() {
  const out = [];
  for (const t of ['area', 'package', 'activity', 'drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document']) {
    for (const e of all(t)) {
      const ref = { t, id: e.id };
      const code = codeOf(ref, e), title = titleOf(ref, e);
      const area = areaOf(ref, e);
      out.push({ ref, code, title, hay: norm(`${code} ${title} ${e.number || ''} ${e.discipline || ''} ${e.responsible || ''} ${area ? 'område ' + area.code : ''} ${TYPES[t].label}`), e });
    }
  }
  return out;
}

function score(hay, code, words) {
  let s = 0;
  for (const w of words) {
    const i = hay.indexOf(w);
    if (i < 0) return -1;
    s += i === 0 ? 30 : hay[i - 1] === ' ' || hay[i - 1] === '-' ? 18 : 6;
    if (norm(code) === w) s += 50; else if (norm(code).startsWith(w)) s += 25;
  }
  return s;
}

export function openPalette(initial = '') {
  if ($('.palette-wrap')) return;
  const items = entityItems();
  const cmds = commands();
  let results = [], act = 0;

  const input = h('input', { class: 'palette-input', placeholder: 'Sök objekt, ritningar, ärenden – eller skriv ett kommando…', spellcheck: 'false', value: initial });
  const list = h('div', { class: 'palette-list', role: 'listbox' });
  const foot = h('div', { class: 'palette-foot' }, h('span', kbd('↑', '↓'), ' navigera'), h('span', kbd('↵'), ' öppna'), h('span', kbd('⇧', '↵'), ' flytande fönster'), h('span', kbd('Esc'), ' stäng'), h('span', { class: 'grow' }), h('span', { class: 'muted' }, '> endast kommandon'));

  const compute = () => {
    const raw = input.value.trim();
    const cmdOnly = raw.startsWith('>');
    const q = norm(cmdOnly ? raw.slice(1).trim() : raw);
    const words = q.split(/\s+/).filter(Boolean);
    const groups = [];
    if (!words.length && !cmdOnly) {
      const rec = recentRefs().slice(0, 6).map((ref) => ({ kind: 'ent', ref, code: codeOf(ref), title: titleOf(ref) }));
      if (rec.length) groups.push(['Senast öppnade', rec]);
      groups.push(['Kommandon', cmds.filter((c) => c.ctx || ['new-action', 'new-issue', 'go-schedule', 'go-tools', 'add-tool'].includes(c.id)).map((c) => ({ kind: 'cmd', ...c }))]);
    } else {
      const cr = cmds.map((c) => ({ c, s: score(norm(`${c.label} ${c.kw} ${c.sub || ''}`), '', words) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, cmdOnly ? 20 : 6).map((x) => ({ kind: 'cmd', ...x.c }));
      if (!cmdOnly) {
        const er = items.map((x) => ({ x, s: score(x.hay, x.code, words) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s);
        // Om frågan är en områdeskod: visa genvägar till områdets information
        const area = all('area').find((a) => words.length === 1 && a.code === words[0]);
        if (area) {
          const aRef = { t: 'area', id: area.id };
          groups.push([`Område ${area.code}`, [
            { kind: 'ent', ref: aRef, code: area.code, title: `Område ${area.code} · ${area.name}` },
            ...[['schedule', 'Aktiviteter', 'gantt'], ['library', 'Ritningar', 'drawing'], ['library/models', 'Modeller', 'cube'], ['issues', 'Ärenden', 'alert'], ['actions', 'Åtgärder', 'kanban'], ['packages', 'Arbetspaket', 'box']]
              .map(([v, l, ic]) => ({ kind: 'cmd', id: `area-${v}`, label: `${area.code} · ${l}`, icon: ic, sub: 'filtrerat på området', run: () => { applyFilter({ area: [area.id] }); app.navigate(`#/${v}`); } }))
          ]]);
        }
        const byType = new Map();
        for (const r of er.slice(0, 40)) {
          if (area && sameArea(r.x.ref, area)) continue;
          const k = TYPES[r.x.ref.t].plural;
          if (!byType.has(k)) byType.set(k, []);
          if (byType.get(k).length < 6) byType.get(k).push({ kind: 'ent', ref: r.x.ref, code: r.x.code, title: r.x.title });
        }
        // Bästa träff först
        const top = er[0];
        if (top && !area) groups.push(['Bästa träff', [{ kind: 'ent', ref: top.x.ref, code: top.x.code, title: top.x.title, best: true }]]);
        for (const [k, l] of byType) { const f = l.filter((x) => !(top && !area && refKey(x.ref) === refKey(top.x.ref))); if (f.length) groups.push([k, f]); }
      }
      if (cr.length) groups.push(['Kommandon', cr]);
    }
    results = groups.flatMap(([, l]) => l);
    act = Math.min(act, Math.max(0, results.length - 1));
    let i = 0;
    list.replaceChildren(...(results.length ? groups.map(([title, l]) => h('div', { class: 'pg' }, h('div', { class: 'pg-head' }, title), l.map((r) => row(r, i++)))) : [h('div', { class: 'palette-empty' }, icon('search', 18), h('span', `Inga träffar för ”${raw}”`))]));
  };
  const sameArea = (ref, area) => ref.t === 'area' && ref.id === area.id;

  const row = (r, i) => {
    const e = r.kind === 'ent' ? get(r.ref) : null;
    const st = e ? statusOf(r.ref, e) : null;
    const el = h('div', { class: `pr ${i === act ? 'act' : ''} ${r.best ? 'best' : ''}`, role: 'option', dataset: { i },
      onpointermove: () => { if (act !== i) { act = i; mark(); } },
      onclick: (ev) => run(r, ev.shiftKey) },
    r.kind === 'ent' ? h('span', { class: `pr-ic ti-${r.ref.t}` }, typeIcon(r.ref.t, 15)) : h('span', { class: 'pr-ic cmd' }, icon(r.icon || 'bolt', 15)),
    r.kind === 'ent' ? [r.code && h('b', { class: 'mono' }, r.code), h('span', { class: 'pr-title' }, r.title.replace(r.code, '').trim() || r.title)] : h('span', { class: 'pr-title' }, r.label, r.sub && h('small', r.sub)),
    h('span', { class: 'grow' }),
    st && STATUS[st] && h('span', { class: `pr-status tone-${STATUS[st].tone}` }, STATUS[st].label),
    r.kind === 'ent' && h('span', { class: 'pr-type' }, TYPES[r.ref.t].label),
    r.kbd && h('span', { class: 'mi-kbd' }, r.kbd));
    return el;
  };
  const mark = () => { $$('.pr', list).forEach((e) => e.classList.toggle('act', +e.dataset.i === act)); $('.pr.act', list)?.scrollIntoView({ block: 'nearest' }); };

  const run = (r, float) => {
    close();
    if (r.kind === 'cmd') { setTimeout(() => r.run(), 10); return; }
    if (float) app.openFloat(r.ref);
    else if (['package', 'tool'].includes(r.ref.t)) app.open(r.ref);
    else app.select(r.ref, { reveal: true });
  };

  input.addEventListener('input', () => { act = 0; compute(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { act = Math.min(results.length - 1, act + 1); mark(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { act = Math.max(0, act - 1); mark(); e.preventDefault(); }
    else if (e.key === 'Enter') { const r = results[act]; if (r) run(r, e.shiftKey); e.preventDefault(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });

  const box = h('div', { class: 'palette', role: 'dialog', 'aria-label': 'Kommandopalett' }, h('div', { class: 'palette-top' }, icon('search', 18), input, kbd('Esc')), list, foot);
  const wrap = h('div', { class: 'palette-wrap', onpointerdown: (e) => { if (e.target === wrap) close(); } }, box);
  $('#layer').append(wrap);
  requestAnimationFrame(() => wrap.classList.add('open'));
  const removeOverlay = pushOverlay(() => close(true));
  function close(fromStack) {
    if (!fromStack) removeOverlay();
    wrap.classList.remove('open'); wrap.classList.add('closing');
    setTimeout(() => wrap.remove(), 140);
  }
  compute();
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}
