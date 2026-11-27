import { all, get, relatedOfType, latestVersion, STATUS, codeOf } from '../store.js';
import { h, icon, badge, avatar, fmtDate, relDays, emptyState, dropTarget, fmtSize } from '../ui.js';
import { filterBar, filtered } from '../filters.js';
import { bindEntity, importIfc, attachFiles } from '../actions.js';
import { app } from '../app.js';

export const meta = { id: 'library', title: 'Ritningar & modeller', icon: 'layers' };

const st = { tab: 'drawings', sort: 'number', q: '' };

export function render(root, { tab } = {}) {
  if (tab) st.tab = tab;
  const view = h('div', { class: 'view view-library' },
    h('div', { class: 'view-head' }, h('div', h('h1', 'Ritningar & modeller'), h('p', { class: 'muted' }, 'Dra en ritning till en aktivitet eller ett paket för att skapa en koppling. Släpp IFC-filer i Modellkontroll.'))),
    filterBar({ dims: ['area', 'discipline', 'status'], period: false }),
    h('nav', { class: 'tabs small' },
      h('a', { class: `tab ${st.tab === 'drawings' ? 'on' : ''}`, href: '#/library/drawings' }, icon('drawing', 14), 'Ritningar', h('em', filtered('drawing').length)),
      h('a', { class: `tab ${st.tab === 'models' ? 'on' : ''}`, href: '#/library/models' }, icon('cube', 14), 'Modellkontroll', h('em', filtered('model').length))),
    st.tab === 'models' ? models() : drawings());
  root.replaceChildren(view);
}

function drawings() {
  let list = filtered('drawing');
  if (st.q) { const q = st.q.toLowerCase(); list = list.filter((d) => `${d.number} ${d.name}`.toLowerCase().includes(q)); }
  list.sort((a, b) => a.number.localeCompare(b.number, 'sv', { numeric: true }));
  const grid = '120px minmax(220px,2fr) 56px 130px 110px 90px 1.2fr';
  return h('div', { class: 'tab-content' },
    h('div', { class: 'toolbar' }, h('label', { class: 'search-inline' }, icon('search', 14), h('input', { placeholder: 'Sök ritningsnummer eller titel…', value: st.q, dataset: { fkey: 'dr-q' }, oninput: (e) => { st.q = e.target.value; app.render(); } }))),
    list.length ? h('div', { class: 'tbl big' },
      h('div', { class: 'tbl-head', style: { gridTemplateColumns: grid } }, ['Nummer', 'Titel', 'Rev', 'Status', 'Disciplin', 'Datum', 'Kopplingar'].map((l) => h('span', l))),
      list.map((d) => {
        const ref = { t: 'drawing', id: d.id };
        const links = [...relatedOfType(ref, 'activity'), ...relatedOfType(ref, 'package'), ...relatedOfType(ref, 'issue')];
        const row = h('div', { class: 'tbl-row', tabindex: '0', dataset: { nav: '1' }, style: { gridTemplateColumns: grid } },
          h('span', h('b', { class: 'mono' }, d.number)), h('span', { class: 'ellipsis' }, d.name), h('span', { class: 'mono' }, d.rev), h('span', badge(d.status)),
          h('span', { class: 'muted' }, d.discipline), h('span', fmtDate(d.date)),
          h('span', { class: 'chips' }, links.slice(0, 4).map((r) => h('span', { class: `mono chip ti-${r.ref.t}` }, codeOf(r.ref))), links.length > 4 && h('span', { class: 'muted small' }, `+${links.length - 4}`)));
        return bindEntity(row, ref);
      })) : emptyState('Inga ritningar matchar', 'Ändra filter eller sökning.'));
}

function models() {
  const list = filtered('model');
  const zone = h('div', { class: 'ifc-zone' },
    h('div', { class: 'ifc-zone-art' }, icon('cube', 28)),
    h('div', h('b', 'Släpp en IFC-fil här'), h('p', 'Filhuvudet läses (schema, program, författare) och en ny version skapas på vald modell. Originalfilen ändras inte.')),
    h('label', { class: 'btn' }, icon('upload', 14), 'Välj fil…', h('input', { type: 'file', accept: '.ifc,.ifczip', hidden: true, onchange: (e) => { const f = e.target.files[0]; if (f) importIfc(f); e.target.value = ''; } })));
  dropTarget(zone, {
    accept: (src) => !!src.files,
    label: () => 'Skapa ny modellversion',
    onDrop: (src) => {
      const f = src.files.find((x) => /\.ifc(zip)?$/i.test(x.name));
      if (f) importIfc(f); else import('../ui.js').then((m) => m.toast('Endast .ifc- eller .ifczip-filer kan importeras här', { tone: 'warn' }));
    }
  });
  return h('div', { class: 'tab-content' }, zone,
    h('div', { class: 'model-grid' }, list.map((m) => {
      const ref = { t: 'model', id: m.id };
      const vs = [...m.versions].sort((a, b) => b.v - a.v);
      const v = vs[0];
      const card = h('article', { class: 'model-tile', tabindex: '0', dataset: { nav: '1' } },
        h('div', { class: 'mt-top' }, h('div', { class: 'mc-icon' }, icon('cube', 20)), h('div', { class: 'grow' }, h('b', m.name), h('small', m.discipline)), h('div', { class: 'mc-ver' }, h('span', { class: 'mono' }, `v${v?.v ?? '–'}`), h('small', v ? relDays(v.date) : ''))),
        h('ol', { class: 'mt-versions' }, vs.slice(0, 4).map((x, i) => h('li', { class: i === 0 ? 'latest' : '' }, h('span', { class: 'mono' }, `v${x.v}`), h('span', { class: 'ellipsis' }, x.note), h('small', fmtDate(x.date))))),
        h('div', { class: 'mt-foot' }, m.responsible && h('span', { class: 'pk-person' }, avatar(m.responsible, 18), m.responsible), h('span', { class: 'grow' }), h('span', { class: 'muted small' }, `${relatedOfType(ref, 'package').length} paket · ${relatedOfType(ref, 'issue').length} ärenden`)));
      bindEntity(card, ref, { drop: false });
      dropTarget(card, {
        accept: (src) => src.files || (src.ref && src.ref.t !== 'model'),
        label: (src) => src?.ref ? `Koppla till ${m.name}` : `Ny version av ${m.name}`,
        onDrop: (src) => {
          if (src.ref) return import('../actions.js').then((a) => a.linkWithFeedback(src.ref, ref));
          const f = src.files.find((x) => /\.ifc(zip)?$/i.test(x.name));
          if (f) importIfc(f, m); else attachFiles(ref, src.files);
        }
      });
      return card;
    })));
}
