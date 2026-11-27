import { all, get, STATUS, parseDate, today, relatedOfType, codeOf } from '../store.js';
import { h, icon, avatar, dueChip, dropTarget } from '../ui.js';
import { filterBar, filtered } from '../filters.js';
import { bindEntity, setStatus, quickAction, createAction, linkWithFeedback, attachFiles } from '../actions.js';
import { app } from '../app.js';

export const meta = { id: 'actions', title: 'Åtgärder', icon: 'kanban' };

const COLS = [
  { id: 'open', label: 'Öppen', hint: 'Att göra' },
  { id: 'doing', label: 'Pågår', hint: 'Någon arbetar med den' },
  { id: 'done', label: 'Klar', hint: 'Avslutad' }
];

export function render(root) {
  const list = filtered('action', { ignore: ['status'] });
  const t = today();
  root.replaceChildren(h('div', { class: 'view view-actions' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Åtgärder'), h('p', { class: 'muted' }, 'Dra kort mellan kolumnerna för att ändra status. Dra ett kort på ett ärende eller paket för att koppla.')),
      h('div', { class: 'head-actions' }, h('button', { class: 'btn primary', onclick: () => createAction() }, icon('plus', 14), 'Ny åtgärd', h('kbd', 'N')))),
    filterBar({ dims: ['area', 'discipline', 'contractor', 'responsible'] }),
    h('div', { class: 'kanban' }, COLS.map((col) => {
      const items = list.filter((a) => a.status === col.id).sort((a, b) => (a.due || '').localeCompare(b.due || ''));
      const quick = col.id === 'open' ? h('form', { class: 'quick-add', onsubmit: (e) => { e.preventDefault(); const v = e.target.q.value.trim(); if (v) { quickAction(v); e.target.q.value = ''; } } },
        icon('plus', 14), h('input', { name: 'q', placeholder: 'Snabbt: skriv och tryck Enter…', dataset: { fkey: 'kb-quick' } })) : null;
      const body = h('div', { class: 'kb-body', dataset: { skey: `kb-${col.id}` } }, quick, items.map((a) => card(a, t)), !items.length && h('div', { class: 'kb-empty' }, 'Släpp ett kort här'));
      const colEl = h('section', { class: `kb-col kb-${col.id}` },
        h('header', h('i', { class: `sdot tone-${STATUS[col.id].tone}` }), h('b', col.label), h('em', items.length), h('span', { class: 'grow' }), h('small', { class: 'muted' }, col.hint)),
        body);
      dropTarget(colEl, {
        accept: (src) => src.ref?.t === 'action' && get(src.ref)?.status !== col.id,
        label: () => `Flytta till ${col.label}`,
        onDrop: (src) => setStatus(src.ref, col.id)
      });
      return colEl;
    }))));
}

function card(a, t) {
  const ref = { t: 'action', id: a.id };
  const overdue = a.status !== 'done' && a.due && parseDate(a.due) < t;
  const pkg = a.packageId ? get({ t: 'package', id: a.packageId }) : null;
  const links = [...relatedOfType(ref, 'issue'), ...relatedOfType(ref, 'drawing')].slice(0, 3);
  const el = h('article', { class: `kb-card ${overdue ? 'overdue' : ''}`, tabindex: '0', dataset: { nav: '1' } },
    h('div', { class: 'kb-card-top' }, h('span', { class: 'mono small' }, a.code), pkg && h('span', { class: 'mono chip' }, pkg.code), h('span', { class: 'grow' }), dueChip(a.due, a.status === 'done')),
    h('p', a.name),
    h('div', { class: 'kb-card-foot' },
      a.responsible ? h('span', { class: 'pk-person' }, avatar(a.responsible, 18), a.responsible) : h('span', { class: 'muted small' }, 'Ej tilldelad'),
      h('span', { class: 'grow' }),
      links.map((r) => h('span', { class: 'mono chip tiny', title: 'Kopplad' }, codeOf(r.ref)))));
  bindEntity(el, ref, { drop: false });
  // Ett åtgärdskort som släpps på ett annat kort flyttas till den kolumnen;
  // annan information (ritningar, ärenden, filer) kopplas till åtgärden.
  dropTarget(el, {
    accept: (src) => src.files ? true : src.ref && src.ref.id !== a.id && (src.ref.t !== 'action' || get(src.ref)?.status !== a.status) && src.ref.t !== 'tool',
    label: (src) => src?.ref?.t === 'action' ? `Flytta till ${STATUS[a.status].label}` : src?.ref ? `Koppla till ${a.code}` : `Bifoga till ${a.code}`,
    onDrop: (src) => {
      if (src.files) return attachFiles(ref, src.files);
      if (src.ref.t === 'action') return setStatus(src.ref, a.status);
      linkWithFeedback(src.ref, ref);
    }
  });
  return el;
}
