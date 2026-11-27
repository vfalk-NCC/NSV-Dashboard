// MY TOOLS – personlig launcher för egna HTML-appar.
// Metadata lagras i huvuddatabasen (db.tools); själva filerna ligger i user_tools/<id>/
// och körs från en separat origin (verktygsservern) i en sandlådad iframe.
import { store, TOOL_CATEGORIES, uid, persist, mutate, emit, fileToBase64, idbPut, idbGet, idbDel } from '../store.js';
import { h, icon, toast, modal, confirmDialog, contextMenu, dropTarget, readDropped, fmtSize, ago, hueOf, norm, emptyState, $, $$, popover, selectList, dropdown } from '../ui.js';
import { app } from '../app.js';

export const meta = { id: 'tools', title: 'My Tools', icon: 'tool' };

const st = { q: '', scope: 'all', cat: null, tags: [], sort: 'recent' };
const tools = () => store.db.tools;
const getTool = (id) => tools().find((t) => t.id === id);

// ------------------------------------------------------------------ körning
export function toolUrl(t) {
  if (store.mode === 'server') return `${store.server.toolOrigin}/tools/${encodeURIComponent(t.id)}/${t.entry.split('/').map(encodeURIComponent).join('/')}`;
  if (t.builtin) return `examples/tools/${t.id}/${t.entry}`;
  return null; // srcdoc från IndexedDB
}
async function localSrc(t) {
  const blob = t.localKey ? await idbGet(t.localKey) : null;
  return blob ? await blob.text() : null;
}
function markUsed(t) {
  t.lastUsed = new Date().toISOString();
  t.useCount = (t.useCount || 0) + 1;
  persist();
}

// ------------------------------------------------------------------ biblioteket
export function render(root) {
  const all = tools();
  const q = norm(st.q);
  let list = all.filter((t) =>
    (st.scope === 'all' || t.scope === st.scope) &&
    (!st.cat || t.category === st.cat) &&
    (!st.tags.length || st.tags.every((x) => (t.tags || []).includes(x))) &&
    (!q || norm(`${t.name} ${t.description} ${(t.tags || []).join(' ')} ${t.category}`).includes(q)));
  const sorters = {
    recent: (a, b) => (b.lastUsed || b.created || '').localeCompare(a.lastUsed || a.created || ''),
    name: (a, b) => a.name.localeCompare(b.name, 'sv'),
    newest: (a, b) => (b.created || '').localeCompare(a.created || '')
  };
  list = [...list].sort(sorters[st.sort]);
  const filtering = q || st.cat || st.tags.length || st.scope !== 'all';
  const favs = list.filter((t) => t.favourite);
  const recent = [...list].filter((t) => t.lastUsed).sort(sorters.recent).slice(0, 4);
  const cats = TOOL_CATEGORIES.map((c) => [c, all.filter((t) => t.category === c).length]);
  const allTags = [...new Set(all.flatMap((t) => t.tags || []))].sort();

  const grid = (items) => h('div', { class: 'tool-grid' }, items.map(toolCard));
  const sec = (title, iconName, items, extra) => items.length ? h('section', { class: 'tool-sec' }, h('div', { class: 'tool-sec-head' }, icon(iconName, 15), h('h3', title), h('em', items.length), extra), grid(items)) : null;

  const view = h('div', { class: 'view view-tools' },
    h('div', { class: 'view-head' },
      h('div', h('h1', 'My Tools'), h('p', { class: 'muted' }, 'Din verktygslåda: egna HTML-appar, kalkylatorer och visualiseringar som körs direkt i hubben.')),
      h('div', { class: 'head-actions' }, h('button', { class: 'btn primary', onclick: () => addToolDialog() }, icon('plus', 14), 'Lägg till verktyg'))),
    store.mode !== 'server' && h('div', { class: 'banner' }, icon('info', 16), h('div', h('b', 'Demoläge i webbläsaren. '), 'Enskilda HTML-filer kan läggas till och köras här. För verktyg i mappar (CSS, JS, bilder, JSON) behöver du starta den lokala servern med ', h('code', 'start.bat'), '. Då hamnar verktygen i ', h('code', 'user_tools/'), '.')),
    h('div', { class: 'toolbar tools-toolbar' },
      h('label', { class: 'search-inline wide' }, icon('search', 14), h('input', { placeholder: 'Sök verktyg, taggar, kategorier…', value: st.q, dataset: { fkey: 'tool-q' }, oninput: (e) => { st.q = e.target.value; app.render(); } })),
      h('div', { class: 'seg' }, [['all', 'Alla'], ['personal', 'Personliga'], ['project', 'Projekt']].map(([k, l]) => h('button', { class: st.scope === k ? 'on' : '', onclick: () => { st.scope = k; app.render(); } }, l))),
      allTags.length ? dropdown({ label: 'Taggar', iconName: 'filter', options: allTags.map((t) => ({ value: t, label: t })), value: st.tags, multi: true, cls: 'dd-filter', onChange: (v) => { st.tags = v; app.render(); } }) : null,
      dropdown({ label: 'Sortera', options: [{ value: 'recent', label: 'Senast använda' }, { value: 'name', label: 'Namn' }, { value: 'newest', label: 'Nyast tillagda' }], value: st.sort, cls: 'dd-filter', onChange: (v) => { st.sort = v; app.render(); } })),
    h('div', { class: 'cat-chips' },
      h('button', { class: `cat-chip ${!st.cat ? 'on' : ''}`, onclick: () => { st.cat = null; app.render(); } }, 'Alla', h('em', all.length)),
      cats.map(([c, n]) => h('button', { class: `cat-chip ${st.cat === c ? 'on' : ''} ${n ? '' : 'zero'}`, onclick: () => { st.cat = st.cat === c ? null : c; app.render(); } }, c, h('em', n)))),
    !all.length ? h('div', { class: 'tools-empty' }, addTile(true))
      : filtering ? (list.length ? grid(list) : emptyState('Inga verktyg matchar', 'Prova en annan sökning eller kategori.'))
        : [sec('Favoriter', 'star', favs), sec('Senast använda', 'clock', recent),
          h('section', { class: 'tool-sec' }, h('div', { class: 'tool-sec-head' }, icon('grid', 15), h('h3', 'Alla verktyg'), h('em', list.length)), h('div', { class: 'tool-grid' }, list.map(toolCard), addTile()))]);

  dropTarget(view, {
    accept: (src) => !!src.files,
    label: () => 'Lägg till som verktyg',
    onDrop: async (src) => addToolDialog(await readDropped(src))
  });
  root.replaceChildren(view);
}

function cover(t, big = false) {
  const hue = hueOf(t.id);
  const el = h('div', { class: `tool-cover ${big ? 'big' : ''}`, style: { '--h': hue } }, h('span', { class: 'tool-glyph' }, t.icon || t.name.slice(0, 1)));
  if (t.cover) { el.style.backgroundImage = `url("${t.cover}")`; el.classList.add('has-img'); }
  return el;
}

function toolCard(t) {
  const card = h('article', { class: 'tool-card', tabindex: '0', dataset: { nav: '1', tool: t.id } },
    cover(t),
    h('button', { class: `iconbtn sm tool-fav ${t.favourite ? 'fav' : ''}`, title: t.favourite ? 'Ta bort favorit' : 'Favorit', onclick: (e) => { e.stopPropagation(); toggleFavTool(t); } }, icon('star', 14)),
    h('div', { class: 'tool-info' },
      h('h4', t.name),
      h('p', t.description || h('span', { class: 'muted' }, 'Ingen beskrivning')),
      h('div', { class: 'tool-meta' },
        h('span', { class: 'chip' }, t.category || 'Övrigt'),
        h('span', { class: 'mono small muted' }, `v${t.version || '1.0'}`),
        h('span', { class: 'muted small', title: t.scope === 'project' ? 'Projektverktyg' : 'Personligt verktyg' }, icon(t.scope === 'project' ? 'box' : 'user', 12)),
        h('span', { class: 'grow' }),
        h('button', { class: 'btn sm primary tool-open', onclick: (e) => { e.stopPropagation(); openTool(t.id); } }, icon('play', 12), 'Öppna'))));
  card.addEventListener('click', () => openTool(t.id));
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openTool(t.id); });
  card.addEventListener('contextmenu', (e) => { e.preventDefault(); contextMenu(e.clientX, e.clientY, toolMenu(t)); });
  return card;
}

function addTile(hero = false) {
  const el = h('button', { class: `tool-add ${hero ? 'hero' : ''}`, onclick: () => addToolDialog() },
    h('span', { class: 'tool-add-ic' }, icon('plus', 22)), h('b', 'Lägg till verktyg'), h('small', 'Välj en HTML-fil, en mapp med index.html eller släpp filerna här'));
  return el;
}

export function openTool(id) { app.navigate(`#/tool/${encodeURIComponent(id)}`); }

function toggleFavTool(t) { t.favourite = !t.favourite; persist(); emit('change', { type: 'tool' }); toast(t.favourite ? `${t.name} tillagd i favoriter` : `${t.name} borttagen från favoriter`, { iconName: 'star' }); }

function toolMenu(t) {
  return [
    { label: 'Öppna', icon: 'play', action: () => openTool(t.id) },
    { label: 'Öppna externt', icon: 'external', action: () => openExternal(t) },
    { label: t.favourite ? 'Ta bort från favoriter' : 'Lägg till i favoriter', icon: 'star', action: () => toggleFavTool(t) },
    { label: 'Redigera information…', icon: 'note', action: () => editToolDialog(t) },
    { divider: true },
    { label: 'Ta bort verktyg…', icon: 'trash', danger: true, action: () => deleteTool(t) }
  ];
}

async function openExternal(t) {
  const url = toolUrl(t);
  if (url) { window.open(url, '_blank', 'noopener'); return; }
  const src = await localSrc(t);
  if (src) window.open(URL.createObjectURL(new Blob([src], { type: 'text/html' })), '_blank', 'noopener');
}

async function deleteTool(t) {
  const ok = await confirmDialog({ title: `Ta bort ${t.name}?`, text: store.mode === 'server' ? `Verktyget avregistreras och kopian i ${t.folder || 'user_tools/' + t.id} raderas. Din originalfil påverkas inte.` : 'Verktyget tas bort från biblioteket. Din originalfil påverkas inte.', okLabel: 'Ta bort', danger: true });
  if (!ok) return;
  if (store.mode === 'server') {
    const r = await fetch(`api/tools/${encodeURIComponent(t.id)}`, { method: 'DELETE' });
    if (!r.ok) { toast('Kunde inte ta bort verktygsmappen', { tone: 'bad' }); return; }
  } else if (t.localKey) await idbDel(t.localKey);
  mutate(`Verktyg borttaget: ${t.name}`, (db) => { db.tools = db.tools.filter((x) => x.id !== t.id); }, { kind: 'delete' });
  toast(`${t.name} borttaget`, { iconName: 'trash' });
  if (app.route.view === 'tool') app.navigate('#/tools');
}

// ------------------------------------------------------------------ lägg till
/** Analysera en mängd filer: hitta gemensam rotmapp, startfil och metadata. */
async function analyze(entries) {
  const errors = [], warnings = [];
  let files = entries.filter((x) => !/(^|\/)(\.git|node_modules|\.DS_Store|Thumbs\.db)(\/|$)/.test(x.path));
  // ta bort gemensam toppmapp
  const firsts = new Set(files.map((x) => x.path.split('/')[0]));
  let folderName = null;
  if (firsts.size === 1 && files.every((x) => x.path.includes('/'))) {
    folderName = [...firsts][0];
    files = files.map((x) => ({ ...x, path: x.path.slice(folderName.length + 1) }));
  }
  const htmls = files.filter((x) => /\.html?$/i.test(x.path));
  let entry = files.find((x) => x.path.toLowerCase() === 'index.html')?.path;
  if (!entry && htmls.length === 1) entry = htmls[0].path;
  if (!htmls.length) errors.push('Ingen HTML-fil hittades. Ett verktyg behöver en startfil, t.ex. index.html.');
  else if (!entry) errors.push(`Ingen index.html i roten. Välj startfil bland ${htmls.length} HTML-filer nedan.`);
  const total = files.reduce((s, x) => s + x.file.size, 0);
  if (total > 150 * 1024 * 1024) errors.push(`Verktyget är för stort (${fmtSize(total)}). Maxstorlek är 150 MB.`);
  if (files.length > 1 && store.mode !== 'server') errors.push('Verktyg med flera filer kräver den lokala servern (start.bat). I demoläget går det bara att lägga till en enskild HTML-fil.');
  let title = '', description = '';
  const readMeta = async (p) => {
    const f = files.find((x) => x.path === p)?.file;
    if (!f) return;
    const text = await f.text();
    title = (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim() || '';
    description = (text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '';
    if (/src=["']file:\/\//i.test(text) || /href=["']file:\/\//i.test(text)) warnings.push('Startfilen refererar till file://-sökvägar. Använd relativa sökvägar så att resurserna hittas.');
    if (/src=["']\/(?!\/)/.test(text)) warnings.push('Startfilen använder rotrelativa sökvägar (src="/..."). Använd relativa sökvägar (src="app.js") så att verktyget fungerar i sin mapp.');
  };
  if (entry) await readMeta(entry);
  return { files, entry, htmls: htmls.map((x) => x.path), errors, warnings, total, folderName, title, description, readMeta };
}

const TEMPLATE = (name) => `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name}</title>
<meta name="description" content="Nytt verktyg skapat från mall">
<style>
  :root { color-scheme: light dark; font-family: system-ui, "Segoe UI", sans-serif; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f1218; color: #e8eaf0; }
  @media (prefers-color-scheme: light) { body { background: #f5f6f8; color: #14171f; } }
  .card { padding: 32px 40px; border-radius: 14px; background: rgba(127,127,127,.08); border: 1px solid rgba(127,127,127,.2); text-align: center; }
  button { font: inherit; padding: 8px 16px; border-radius: 8px; border: 0; background: #4f8cff; color: #fff; cursor: pointer; }
</style>
</head>
<body>
  <div class="card">
    <h1>${name}</h1>
    <p>Redigera <code>index.html</code> i verktygsmappen för att bygga vidare.</p>
    <button id="b">Klicka</button> <span id="n">0</span>
  </div>
  <script>
    let n = 0; document.getElementById('b').onclick = () => { document.getElementById('n').textContent = ++n; };
  </script>
</body>
</html>
`;

export async function addToolDialog(initial = null) {
  let analysis = null;
  const filesInput = h('input', { type: 'file', accept: '.html,.htm', hidden: true });
  const dirInput = h('input', { type: 'file', hidden: true, webkitdirectory: true, directory: true, multiple: true });
  const stage = h('div', { class: 'add-stage' });

  const pickStage = () => {
    const zone = h('div', { class: 'add-drop' }, icon('upload', 26), h('b', 'Släpp en HTML-fil eller en hel mapp här'), h('span', { class: 'muted' }, 'Originalet ändras inte. En kopia registreras i user_tools/.'));
    dropTarget(zone, { accept: (s) => !!s.files, label: () => 'Analysera', onDrop: async (s) => show(await readDropped(s)) });
    stage.replaceChildren(
      h('div', { class: 'add-options' },
        h('button', { class: 'add-opt', onclick: () => filesInput.click() }, icon('file', 22), h('b', 'Välj HTML-fil'), h('small', 'En fristående .html')),
        h('button', { class: 'add-opt', onclick: () => dirInput.click(), disabled: store.mode !== 'server', title: store.mode !== 'server' ? 'Kräver lokal server' : '' }, icon('folder', 22), h('b', 'Välj mapp'), h('small', 'Mapp med index.html, CSS, JS, assets')),
        h('button', { class: 'add-opt', onclick: () => fromTemplate() }, icon('sparkle', 22), h('b', 'Starta från mall'), h('small', 'Skapar ett nytt tomt verktyg'))),
      zone);
  };

  const show = async (entries) => {
    if (!entries?.length) return;
    stage.replaceChildren(h('div', { class: 'skeleton' }, h('i'), h('i'), h('i')));
    analysis = await analyze(entries);
    detailsStage();
  };

  const fromTemplate = () => {
    const name = 'Nytt verktyg';
    const file = new File([TEMPLATE(name)], 'index.html', { type: 'text/html' });
    show([{ file, path: 'index.html' }]);
  };

  const form = {};
  const detailsStage = () => {
    const a = analysis;
    const entrySel = a.htmls.length > 1 ? h('select', { class: 'input', onchange: async (e) => { a.entry = e.target.value; a.errors = a.errors.filter((x) => !x.startsWith('Ingen index.html')); a.warnings = []; await a.readMeta(a.entry); detailsStage(); } },
      h('option', { value: '', disabled: true, selected: !a.entry }, 'Välj startfil…'), a.htmls.map((p) => h('option', { value: p, selected: p === a.entry }, p))) : null;
    const field = (key, label, el) => { form[key] = el; return h('label', { class: `field ${['description', 'notes'].includes(key) ? 'full' : ''}` }, h('span', label), el); };
    const nameDefault = form.name?.value || a.title || (a.folderName || a.files[0]?.path || 'Verktyg').replace(/\.html?$/i, '').replace(/[-_]/g, ' ');
    stage.replaceChildren(
      h('div', { class: `validation ${a.errors.length ? 'bad' : 'ok'}` },
        h('div', { class: 'val-row' }, icon(a.entry ? 'checkCircle' : 'alert', 16), a.entry ? h('span', 'Startfil: ', h('code', a.entry)) : h('span', 'Startfil saknas')),
        h('div', { class: 'val-row muted' }, icon('folder', 16), `${a.files.length} filer · ${fmtSize(a.total)}${a.folderName ? ` · från mappen ${a.folderName}` : ''}`),
        a.errors.map((e) => h('div', { class: 'val-row err' }, icon('alert', 16), e)),
        a.warnings.map((w) => h('div', { class: 'val-row warn' }, icon('info', 16), w)),
        entrySel && h('label', { class: 'field' }, h('span', 'Startfil'), entrySel),
        a.files.length > 1 && h('details', { class: 'file-list' }, h('summary', 'Visa filer'), h('ul', a.files.slice(0, 200).map((x) => h('li', h('code', x.path), h('small', fmtSize(x.file.size)))))))
      ,
      h('div', { class: 'form-grid' },
        field('name', 'Namn', h('input', { class: 'input', value: nameDefault })),
        field('category', 'Kategori', h('select', { class: 'input' }, TOOL_CATEGORIES.map((c) => h('option', { value: c, selected: c === (form.category?.value || 'Övrigt') }, c)))),
        field('description', 'Beskrivning', h('input', { class: 'input', value: form.description?.value || a.description || '' })),
        field('scope', 'Typ', h('select', { class: 'input' }, h('option', { value: 'personal' }, 'Personligt verktyg'), h('option', { value: 'project', selected: form.scope?.value === 'project' }, 'Projektverktyg'))),
        field('version', 'Version', h('input', { class: 'input', value: form.version?.value || '1.0' })),
        field('icon', 'Ikon (tecken/emoji)', h('input', { class: 'input', value: form.icon?.value || '', maxlength: 4, placeholder: 'T.ex. ⚙ eller Σ' })),
        field('tags', 'Taggar (kommaseparerade)', h('input', { class: 'input', value: form.tags?.value || '', placeholder: 'betong, kalkyl' })),
        field('notes', 'Anteckningar', h('textarea', { class: 'input', rows: 2 }, form.notes?.value || ''))));
    const regBtn = $('.modal-foot .btn.primary', m.el);
    if (regBtn) regBtn.disabled = !!a.errors.length || !a.entry;
  };

  const register = async () => {
    const a = analysis;
    if (!a || a.errors.length || !a.entry) return false;
    const metaIn = {
      name: form.name.value.trim() || 'Verktyg', description: form.description.value.trim(), category: form.category.value, scope: form.scope.value,
      version: form.version.value.trim() || '1.0', icon: form.icon.value.trim(), tags: form.tags.value.split(',').map((x) => x.trim()).filter(Boolean), notes: form.notes.value.trim()
    };
    const btn = $('.modal-foot .btn.primary', m.el); btn.disabled = true; btn.textContent = 'Registrerar…';
    try {
      const now = new Date().toISOString();
      let id, folder, localKey = null;
      if (store.mode === 'server') {
        const payload = { name: metaIn.name, entry: a.entry, files: [] };
        for (const x of a.files) payload.files.push({ path: x.path, data: await fileToBase64(x.file) });
        const r = await fetch('api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'Registreringen misslyckades');
        id = j.id; folder = j.folder;
      } else {
        id = uid('tool'); localKey = `tool-${id}`;
        await idbPut(localKey, a.files[0].file);
        folder = '(webbläsarens lagring)';
      }
      const tool = { id, ...metaIn, entry: a.entry, folder, localKey, favourite: false, created: now, modified: now, lastUsed: null, useCount: 0, fileCount: a.files.length, size: a.total };
      mutate(`Verktyg registrerat: ${tool.name}`, (db) => db.tools.unshift(tool), { kind: 'create' });
      toast(h('span', h('b', tool.name), ' registrerat'), { tone: 'ok', iconName: 'tool', action: { label: 'Öppna', fn: () => openTool(tool.id) } });
      return true;
    } catch (e) {
      toast(e.message, { tone: 'bad' });
      btn.disabled = false; btn.textContent = 'Registrera';
      return false;
    }
  };

  filesInput.onchange = () => show([...filesInput.files].map((f) => ({ file: f, path: f.name })));
  dirInput.onchange = () => show([...dirInput.files].map((f) => ({ file: f, path: f.webkitRelativePath || f.name })));

  const m = modal({
    title: 'Lägg till verktyg', subtitle: 'Registrera en egen HTML-app i My Tools', width: 640, cls: 'modal-add-tool',
    body: h('div', stage, filesInput, dirInput),
    actions: [{ label: 'Börja om', ghost: true, icon: 'refresh', onClick: () => { analysis = null; pickStage(); return false; } }, { spacer: true }, { label: 'Avbryt', ghost: true }, { label: 'Registrera', primary: true, disabled: true, onClick: register }]
  });
  if (initial?.length) show(initial); else pickStage();
}

export function editToolDialog(t) {
  const f = {};
  const field = (key, label, el, full) => { f[key] = el; return h('label', { class: `field ${full ? 'full' : ''}` }, h('span', label), el); };
  let coverData = t.cover || null;
  const coverPrev = cover(t);
  const coverInput = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async (e) => {
    const file = e.target.files[0]; if (!file) return;
    coverData = await downscale(file, 640);
    coverPrev.style.backgroundImage = `url("${coverData}")`; coverPrev.classList.add('has-img');
  } });
  modal({
    title: 'Verktygsinformation', subtitle: `${t.folder || ''} · startfil ${t.entry}`, width: 620,
    body: h('div', h('div', { class: 'cover-edit' }, coverPrev, h('div', h('button', { class: 'btn sm', onclick: () => coverInput.click() }, icon('image', 13), 'Välj omslagsbild'), ' ', h('button', { class: 'btn sm ghost', onclick: () => { coverData = null; coverPrev.style.backgroundImage = ''; coverPrev.classList.remove('has-img'); } }, 'Ta bort'), coverInput, h('p', { class: 'muted small' }, 'Kommande: automatisk skärmbild av verktyget som miniatyr.'))),
      h('div', { class: 'form-grid' },
        field('name', 'Namn', h('input', { class: 'input', value: t.name })),
        field('category', 'Kategori', h('select', { class: 'input' }, TOOL_CATEGORIES.map((c) => h('option', { value: c, selected: c === t.category }, c)))),
        field('description', 'Beskrivning', h('input', { class: 'input', value: t.description || '' }), true),
        field('scope', 'Typ', h('select', { class: 'input' }, h('option', { value: 'personal' }, 'Personligt verktyg'), h('option', { value: 'project', selected: t.scope === 'project' }, 'Projektverktyg'))),
        field('version', 'Version', h('input', { class: 'input', value: t.version || '' })),
        field('icon', 'Ikon', h('input', { class: 'input', value: t.icon || '', maxlength: 4 })),
        field('tags', 'Taggar', h('input', { class: 'input', value: (t.tags || []).join(', ') })),
        field('notes', 'Anteckningar', h('textarea', { class: 'input', rows: 3 }, t.notes || ''), true))),
    actions: [{ spacer: true }, { label: 'Avbryt', ghost: true }, { label: 'Spara', primary: true, onClick: () => {
      mutate(`Verktyg uppdaterat: ${f.name.value}`, () => Object.assign(t, {
        name: f.name.value.trim() || t.name, category: f.category.value, description: f.description.value.trim(), scope: f.scope.value,
        version: f.version.value.trim(), icon: f.icon.value.trim(), tags: f.tags.value.split(',').map((x) => x.trim()).filter(Boolean), notes: f.notes.value.trim(),
        cover: coverData, modified: new Date().toISOString()
      }), { kind: 'edit' });
      toast('Verktyget uppdaterades', { tone: 'ok' });
    } }]
  });
}

function downscale(file, max) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.82));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

// ------------------------------------------------------------------ verktygsarbetsyta
let current = null;
export function renderWorkspace(root, id) {
  const t = getTool(id);
  if (!t) { root.replaceChildren(emptyState('Verktyget finns inte', 'Det kan ha tagits bort.', h('button', { class: 'btn', onclick: () => app.navigate('#/tools') }, 'Till My Tools'))); current = null; return; }
  markUsed(t);
  const sandbox = store.mode === 'server'
    ? 'allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads allow-pointer-lock'
    : 'allow-scripts allow-forms allow-modals allow-popups allow-downloads';
  const frame = h('iframe', { class: 'tool-frame', sandbox, allow: 'fullscreen; clipboard-write', referrerpolicy: 'no-referrer', title: t.name });
  const loader = h('div', { class: 'tool-loading' }, h('div', { class: 'spinner' }), h('span', `Startar ${t.name}…`));
  const stageEl = h('div', { class: 'tool-stage' }, frame, loader);
  frame.addEventListener('load', () => loader.classList.add('done'));

  const load = async () => {
    loader.classList.remove('done');
    const url = toolUrl(t);
    if (url) { frame.removeAttribute('srcdoc'); frame.src = url + (url.includes('?') ? '&' : '?') + '_r=' + Date.now(); }
    else {
      const src = await localSrc(t);
      if (src == null) { loader.replaceChildren(icon('alert', 20), h('span', 'Verktygets fil hittades inte i webbläsarens lagring.')); return; }
      frame.srcdoc = src;
    }
  };

  const info = h('aside', { class: 'tool-info-panel' });
  const renderInfo = async () => {
    info.replaceChildren(
      h('div', { class: 'tip-head' }, cover(t, true), h('div', h('b', t.name), h('small', `${t.category} · v${t.version || '1.0'}`))),
      h('p', t.description || ''),
      h('dl', { class: 'props' },
        ...[['Verktygs-ID', h('code', t.id)], ['Startfil', h('code', t.entry)], ['Mapp', h('code', t.folder || '–')], ['Typ', t.scope === 'project' ? 'Projektverktyg' : 'Personligt'], ['Skapad', t.created ? ago(t.created) : '–'], ['Ändrad', t.modified ? ago(t.modified) : '–'], ['Använt', `${t.useCount || 0} gånger`], ['Taggar', (t.tags || []).join(', ') || '–']]
          .map(([k, v]) => h('div', { class: 'prop' }, h('dt', k), h('dd', v)))),
      t.notes && h('div', { class: 'ctx-desc pre' }, t.notes),
      h('div', { class: 'tip-sec' }, h('b', 'Säkerhet'), h('p', { class: 'muted small' }, store.mode === 'server'
        ? `Körs på en separat origin (${store.server.toolOrigin}) i en sandlådad iframe. Verktyget når inte hubbens data eller gränssnitt.`
        : 'Körs i en sandlådad iframe med egen, isolerad origin. Verktyget når inte hubbens data.')),
      h('div', { class: 'tip-sec' }, h('b', 'Project Control Hub API'), h('p', { class: 'muted small' }, store.server?.toolApi ? 'Påslaget, endast läsning: GET /api/project/activities m.fl. på verktygsservern.' : 'Avstängt. Kan slås på i config.json (endast läsning) så att dina verktyg kan hämta projektdata.'))
    );
    if (store.mode === 'server') {
      try {
        const r = await fetch(`api/tools/${encodeURIComponent(t.id)}/files`);
        if (r.ok) { const j = await r.json(); info.append(h('details', { class: 'file-list', open: j.files.length < 12 }, h('summary', `${j.files.length} filer`), h('ul', j.files.map((f) => h('li', h('code', f.path), h('small', fmtSize(f.size))))))); }
      } catch {}
    }
  };

  const infoOn = () => root.querySelector('.view-tool')?.classList.contains('info-open');
  const head = h('div', { class: 'tool-bar' },
    h('button', { class: 'btn sm ghost', title: 'Tillbaka (Alt+←)', onclick: () => (history.length > 1 ? history.back() : app.navigate('#/tools')) }, icon('back', 14), 'Tillbaka'),
    h('div', { class: 'tool-bar-title' }, h('span', { class: 'tool-glyph sm', style: { '--h': hueOf(t.id) } }, t.icon || t.name[0]), h('b', t.name), h('span', { class: 'mono small muted' }, `v${t.version || '1.0'}`), h('span', { class: 'chip' }, t.category)),
    h('span', { class: 'grow' }),
    h('button', { class: `iconbtn ${t.favourite ? 'fav' : ''}`, title: 'Favorit', onclick: (e) => { toggleFavTool(t); e.currentTarget.classList.toggle('fav', t.favourite); } }, icon('star', 16)),
    h('button', { class: 'iconbtn', title: 'Uppdatera (Ctrl+R stängs av här – använd R)', onclick: load }, icon('refresh', 16)),
    h('button', { class: 'iconbtn', title: 'Öppna externt', onclick: () => openExternal(t) }, icon('external', 16)),
    h('button', { class: 'iconbtn', title: 'Helskärm', onclick: () => stageEl.requestFullscreen?.() }, icon('maximize', 16)),
    h('button', { class: 'iconbtn', title: 'Verktygsinformation (I)', onclick: () => { root.querySelector('.view-tool').classList.toggle('info-open'); if (infoOn()) renderInfo(); } }, icon('info', 16)),
    h('button', { class: 'iconbtn', title: 'Fler val', onclick: (e) => { const r = e.currentTarget.getBoundingClientRect(); contextMenu(r.right - 220, r.bottom + 4, toolMenu(t)); } }, icon('dots', 16)));

  root.replaceChildren(h('div', { class: 'view view-tool' }, head, h('div', { class: 'tool-body' }, stageEl, info)));
  load();
  current = { id, load, renderInfo, root, toggleInfo: () => { root.querySelector('.view-tool').classList.toggle('info-open'); if (infoOn()) renderInfo(); } };
}

/** Kallas vid dataändringar – laddar inte om iframen. */
export function updateWorkspace() {
  if (!current) return;
  const t = getTool(current.id);
  if (!t) app.navigate('#/tools');
}

export function workspaceKeys(e) {
  if (!current) return false;
  if (e.key === 'r' || e.key === 'R') { current.load(); return true; }
  if (e.key === 'i' || e.key === 'I') { current.toggleInfo(); return true; }
  return false;
}
