// Kontextpanel: detaljer, kopplingar och historik för valt objekt.
// Används både i högerpanelen och i flytande fönster.
import {
  store, TYPES, STATUS, STATUS_SETS, PRIORITY, get, all, codeOf, titleOf, labelOf, statusOf, areaOf, related, historyFor,
  latestVersion, packageProgress, refKey, sameRef, update, mutate, fileUrl, parseDate, daysBetween, today, unlink
} from './store.js';
import { h, icon, typeIcon, badge, prioBadge, avatar, progressBar, fmtDate, relDays, ago, dueChip, contextMenu, emptyState, fmtSize, dropTarget, hueOf, docIcon, popover, selectList } from './ui.js';
import {
  bindEntity, entityMenu, showEntityMenu, setStatus, assign, linkPicker, addNote, addToWhiteboard, toggleFav, isFav, openSource,
  changeDeadline, attachFiles, linkWithFeedback, editEntity, createAction, importIfc
} from './actions.js';
import { app } from './app.js';

const COLLAPSE_KEY = 'pch.ctx.collapsed';
const collapsed = new Set((() => { try { return JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '[]'); } catch { return []; } })());
const saveCollapsed = () => { try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...collapsed])); } catch {} };

function section(id, title, count, body, { actions } = {}) {
  const isC = collapsed.has(id);
  const sec = h('section', { class: `ctx-sec ${isC ? 'collapsed' : ''}`, dataset: { sec: id } },
    h('header', { onclick: (e) => { if (e.target.closest('button')) return; sec.classList.toggle('collapsed'); sec.classList.contains('collapsed') ? collapsed.add(id) : collapsed.delete(id); saveCollapsed(); } },
      icon('chevD', 14, 'sec-chev'), h('span', title), count != null && h('em', count), h('span', { class: 'grow' }), actions),
    h('div', { class: 'ctx-sec-body' }, h('div', { class: 'ctx-sec-inner' }, body)));
  return sec;
}

function prop(label, value, opts = {}) {
  if (value == null || value === '') return null;
  return h('div', { class: `prop ${opts.click ? 'clickable' : ''}`, onclick: opts.click }, h('dt', label), h('dd', value));
}

export function relRow(ref, relId, { compact = false } = {}) {
  const e = get(ref);
  const st = statusOf(ref, e);
  const row = h('div', { class: `relrow ${compact ? 'compact' : ''}` },
    h('span', { class: `relrow-ic ti-${ref.t}` }, typeIcon(ref.t, 13)),
    h('b', { class: 'mono' }, codeOf(ref, e)),
    h('span', { class: 'relrow-title' }, titleOf(ref, e).replace(codeOf(ref, e), '').trim() || titleOf(ref, e)),
    st && STATUS[st] && h('i', { class: `sdot tone-${STATUS[st].tone}`, title: STATUS[st].label }),
    relId ? h('button', { class: 'iconbtn xs unlink', title: 'Ta bort koppling', onclick: (ev) => { ev.stopPropagation(); unlink(relId); } }, icon('x', 12)) : h('span', { class: 'relrow-via', title: 'Strukturell koppling' }, icon('layers', 11)));
  bindEntity(row, ref, { drop: true });
  return row;
}

function statusControl(ref, e) {
  const set = STATUS_SETS[ref.t];
  const st = statusOf(ref, e);
  if (!set || ref.t === 'activity') return badge(st);
  const b = h('button', { class: 'status-btn', title: 'Ändra status' }, badge(st), icon('chevD', 12));
  b.onclick = () => {
    let pop;
    const sl = selectList({ options: set.map((s) => ({ value: s, label: STATUS[s].label })), selected: [e.status], multi: false, onCommit: (v) => { pop.close(); setStatus(ref, v); } });
    pop = popover(b, sl.el, { cls: 'pop-select' });
  };
  return b;
}

function personControl(ref, e) {
  const b = h('button', { class: 'person-btn', title: 'Tilldela' }, e.responsible ? [avatar(e.responsible, 18), e.responsible] : h('span', { class: 'muted' }, 'Ej tilldelad'));
  b.onclick = () => {
    let pop;
    const sl = selectList({ options: [...new Set([...(store.db.people || []), ...all('action').map((a) => a.responsible).filter(Boolean)])].map((p) => ({ value: p, label: p })), selected: [e.responsible], multi: false, onCommit: (v) => { pop.close(); assign(ref, v); } });
    pop = popover(b, sl.el, { cls: 'pop-select' });
  };
  return b;
}

function relationsBlock(ref) {
  const rels = related(ref);
  const order = ['area', 'package', 'activity', 'issue', 'action', 'drawing', 'model', 'decision', 'meeting', 'document'];
  const groups = order.map((t) => [t, rels.filter((r) => r.ref.t === t)]).filter(([, l]) => l.length);
  const body = h('div', { class: 'rel-groups' },
    groups.length ? groups.map(([t, l]) => h('div', { class: 'rel-group' },
      h('div', { class: 'rel-head' }, typeIcon(t, 12), TYPES[t].plural, h('em', l.length)),
      l.slice(0, 30).map((r) => relRow(r.ref, r.relId, { compact: true })),
      l.length > 30 && h('div', { class: 'muted small' }, `+ ${l.length - 30} till`)))
      : h('p', { class: 'muted small' }, 'Inga kopplingar ännu.'),
    h('div', { class: 'ctx-dropzone' }, icon('link', 14), 'Dra information eller filer hit för att koppla'));
  return section('rel', 'Kopplingar', rels.length, body, {
    actions: h('button', { class: 'iconbtn sm', title: 'Koppla information…', onclick: () => linkPicker(ref, ['drawing', 'model', 'issue', 'action', 'decision', 'meeting', 'document', 'activity', 'package'].filter((x) => x !== ref.t)) }, icon('plus', 14))
  });
}

function historyBlock(ref) {
  const list = historyFor(ref);
  const e = get(ref);
  const body = list.length || e.created ? h('ol', { class: 'timeline' },
    list.slice(0, 40).map((x) => h('li', h('i', { class: `tl-dot k-${x.kind}` }), h('div', h('span', x.text), h('small', ago(x.ts))))),
    e.created && !list.some((x) => x.kind === 'create') && h('li', h('i', { class: 'tl-dot k-create' }), h('div', h('span', 'Skapad'), h('small', ago(e.created)))))
    : h('p', { class: 'muted small' }, 'Ingen historik ännu.');
  return section('hist', 'Historik', list.length, body);
}

function notesBlock(ref, e) {
  const notes = e.notes || [];
  return section('notes', 'Anteckningar', notes.length,
    notes.length ? notes.map((n) => h('div', { class: 'note' }, h('p', n.text), h('small', ago(n.ts)))) : h('p', { class: 'muted small' }, 'Inga anteckningar.'),
    { actions: h('button', { class: 'iconbtn sm', title: 'Lägg till anteckning', onclick: () => addNote(ref) }, icon('plus', 14)) });
}

function specific(ref, e) {
  const out = [];
  if (ref.t === 'activity') {
    const range = h('input', { type: 'range', min: 0, max: 100, step: 5, value: e.progress, class: 'range', dataset: { fkey: 'ctx-progress' } });
    const val = h('b', `${e.progress}%`);
    range.addEventListener('input', () => { val.textContent = `${range.value}%`; range.style.setProperty('--v', range.value + '%'); });
    range.style.setProperty('--v', e.progress + '%');
    range.addEventListener('change', () => update(ref, { progress: +range.value }, `${e.code} framdrift ${range.value}%`));
    const dur = daysBetween(parseDate(e.start), parseDate(e.end)) + 1;
    out.push(h('div', { class: 'ctx-progress' }, h('div', { class: 'row-between' }, h('span', { class: 'muted small' }, 'Framdrift'), val), range,
      h('div', { class: 'row-between small muted' }, h('span', `${fmtDate(e.start)} → ${fmtDate(e.end)}`), h('span', `${dur} dagar`))));
  }
  if (ref.t === 'package') {
    const pct = packageProgress(e);
    out.push(h('div', { class: 'ctx-progress' }, h('div', { class: 'row-between' }, h('span', { class: 'muted small' }, 'Framdrift (vägd från aktiviteter)'), h('b', `${pct}%`)), progressBar(pct, 'lg')));
  }
  if (ref.t === 'model') {
    const vs = [...(e.versions || [])].sort((a, b) => b.v - a.v);
    out.push(section('versions', 'Versioner', vs.length, h('ol', { class: 'versions' }, vs.map((v, i) => h('li', { class: i === 0 ? 'latest' : '' },
      h('b', `v${v.v}`), h('div', h('span', v.note || '–'), h('small', `${fmtDate(v.date)} · ${v.author || ''} · ${v.schema || ''}${v.size ? ' · ' + fmtSize(v.size) : ''}`)),
      i === 0 && h('span', { class: 'badge tone-accent' }, 'Senaste'))))));
  }
  if (ref.t === 'drawing') {
    out.push(h('div', { class: 'drawing-preview' }, h('div', { class: 'dp-sheet' }, h('span', e.number), h('small', `Rev ${e.rev}`))));
  }
  if (ref.t === 'document') {
    const prev = h('div', { class: `doc-preview kind-${e.kind}`, style: { '--h': e.hue ?? hueOf(e.name) } }, icon(docIcon(e.kind), 28));
    if (e.kind === 'photo' && e.file) fileUrl(e.file).then((u) => { if (u) { prev.style.backgroundImage = `url("${u}")`; prev.classList.add('has-img'); prev.replaceChildren(); } });
    out.push(prev);
    if (e.kind === 'email') out.push(h('dl', { class: 'props' }, prop('Från', e.from), prop('Ämne', e.subject)));
  }
  if (ref.t === 'meeting' && e.notes) out.push(h('div', { class: 'ctx-desc pre' }, e.notes));
  return out;
}

/** Bygg kontextinnehåll för ref. */
export function renderContext(ref, { float = false, focus } = {}) {
  const e = get(ref);
  if (!e) return emptyState('Objektet finns inte längre', 'Det kan ha tagits bort.');
  const area = areaOf(ref, e);
  const pkg = e.packageId ? get({ t: 'package', id: e.packageId }) : null;
  const code = codeOf(ref, e);

  const head = h('div', { class: 'ctx-head' },
    h('div', { class: 'ctx-kicker' },
      h('span', { class: `type-tag ti-${ref.t}` }, typeIcon(ref.t, 12), TYPES[ref.t].label),
      area && h('button', { class: 'crumb-chip', onclick: () => app.select({ t: 'area', id: area.id }) }, area.code),
      pkg && h('button', { class: 'crumb-chip', onclick: () => app.select({ t: 'package', id: pkg.id }) }, pkg.code),
      h('span', { class: 'grow' }),
      h('button', { class: `iconbtn sm ${isFav(ref) ? 'fav' : ''}`, title: 'Favorit', onclick: () => toggleFav(ref) }, icon('star', 14)),
      h('button', { class: 'iconbtn sm', title: 'Fler val', onclick: (ev) => { const r = ev.currentTarget.getBoundingClientRect(); contextMenu(r.left - 200, r.bottom + 4, entityMenu(ref)); } }, icon('dots', 16))),
    h('h2', { class: 'ctx-title' }, code && ref.t !== 'area' && h('span', { class: 'mono code' }, code), titleOf(ref, e).replace(code, '').trim() || titleOf(ref, e)),
    h('div', { class: 'ctx-badges' },
      statusControl(ref, e),
      e.priority && h('span', { class: 'chip' }, prioBadge(e.priority), PRIORITY[e.priority].label),
      e.due && dueChip(e.due, ['done', 'resolved', 'closed'].includes(e.status)),
      ref.t === 'drawing' && h('span', { class: 'chip mono' }, `Rev ${e.rev}`),
      ref.t === 'model' && h('span', { class: 'chip mono' }, `v${latestVersion(e)?.v ?? '–'}`)));

  const quick = h('div', { class: 'ctx-quick' },
    ref.t !== 'area' && h('button', { class: 'btn sm', onclick: () => app.open(ref) }, icon('eye', 14), 'Öppna'),
    !float && h('button', { class: 'btn sm ghost', title: 'Öppna i flytande fönster (Shift+klick)', onclick: () => app.openFloat(ref) }, icon('window', 14)),
    h('button', { class: 'btn sm ghost', title: 'Lägg på whiteboard', onclick: () => addToWhiteboard(ref) }, icon('board', 14)),
    h('button', { class: 'btn sm ghost', title: 'Koppla information', onclick: () => linkPicker(ref, ['drawing', 'model', 'issue', 'action', 'decision', 'document', 'activity', 'package'].filter((x) => x !== ref.t)) }, icon('link', 14)),
    (ref.t === 'drawing' || ref.t === 'model' || e.file) && h('button', { class: 'btn sm ghost', title: 'Öppna källa', onclick: () => openSource(ref) }, icon('external', 14)),
    ['issue', 'package', 'activity'].includes(ref.t) && h('button', { class: 'btn sm ghost', title: 'Skapa åtgärd', onclick: () => createAction({ linkTo: ref, packageId: ref.t === 'package' ? e.id : e.packageId }) }, icon('check', 14)),
    ref.t !== 'area' && h('button', { class: 'btn sm ghost', title: 'Redigera (E)', onclick: () => editEntity(ref) }, icon('note', 14)));

  const props = h('dl', { class: 'props' },
    prop('Ansvarig', ['issue', 'action', 'package', 'activity', 'decision'].includes(ref.t) ? personControl(ref, e) : e.responsible),
    prop('WBS', e.wbs && h('span', { class: 'mono' }, e.wbs)),
    prop('Disciplin', e.discipline),
    prop('Entreprenör', e.contractor),
    prop('Typ', e.kind && ref.t !== 'document' ? e.kind : null),
    ref.t === 'area' && prop('Arbetspaket', all('package').filter((p) => p.areaId === e.id).length),
    prop('Datum', (ref.t === 'drawing' || ref.t === 'decision' || ref.t === 'meeting' || ref.t === 'document') && e.date ? `${fmtDate(e.date, true)} · ${relDays(e.date)}` : null),
    prop('Deadline', e.due ? h('span', { class: 'clickable-text', onclick: () => changeDeadline(ref) }, fmtDate(e.due, true)) : null),
    prop('Skapad', e.created ? ago(e.created) : null),
    ref.t === 'document' && prop('Fil', e.file ? h('button', { class: 'linkbtn', onclick: () => openSource(ref) }, e.name, e.size ? ` · ${fmtSize(e.size)}` : '') : h('span', { class: 'muted' }, 'Ingen fil – exempeldata')));

  const body = h('div', { class: 'ctx-body', dataset: { skey: 'ctx-body' } },
    quick,
    ...specific(ref, e),
    e.description && h('div', { class: 'ctx-desc' }, e.description),
    section('props', 'Egenskaper', null, props),
    relationsBlock(ref),
    ref.t === 'model' && h('div', { class: 'ifc-drop', dataset: { ifc: '1' } }, icon('upload', 14), 'Släpp en IFC-fil här för ny version'),
    notesBlock(ref, e),
    historyBlock(ref));

  const root = h('div', { class: `ctx ${float ? 'is-float' : ''}`, dataset: { ref: refKey(ref) } }, head, body);
  dropTarget(body, {
    accept: (src) => (src.ref ? !sameRef(src.ref, ref) : !!src.files),
    label: (src) => src?.ref ? `Koppla till ${labelOf(ref)}` : ref.t === 'model' ? 'Skapa ny modellversion / bifoga' : `Bifoga till ${labelOf(ref)}`,
    onDrop: (src) => {
      if (src.ref) return linkWithFeedback(src.ref, ref);
      const ifc = src.files.filter((f) => /\.ifc(zip)?$/i.test(f.name));
      if (ref.t === 'model' && ifc.length) { importIfc(ifc[0], e); return; }
      attachFiles(ref, src.files);
    }
  });
  if (focus) requestAnimationFrame(() => {
    const sec = root.querySelector(`[data-sec="${focus === 'history' ? (ref.t === 'model' ? 'versions' : 'hist') : focus}"]`);
    if (sec) { sec.classList.remove('collapsed'); sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); sec.classList.add('flash'); }
  });
  return root;
}
