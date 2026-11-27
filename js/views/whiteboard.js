import { store, get, codeOf, titleOf, statusOf, STATUS, TYPES, related, sameRef, persist, mutate, uid, labelOf, latestVersion, emit } from '../store.js';
import { h, icon, typeIcon, badge, avatar, dueChip, dropTarget, contextMenu, toast, confirmDialog } from '../ui.js';
import { entityMenu, addToWhiteboard } from '../actions.js';
import { app } from '../app.js';

export const meta = { id: 'whiteboard', title: 'Whiteboard', icon: 'board' };

const COLORS = ['amber', 'blue', 'green', 'pink', 'violet'];
let saveT;
const saveView = () => { clearTimeout(saveT); saveT = setTimeout(() => persist(), 400); };

export function render(root) {
  const wb = store.db.whiteboard;
  const v = wb.view;
  const world = h('div', { class: 'wb-world' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'wb-links');
  world.append(svg);
  const canvas = h('div', { class: 'wb-canvas', tabindex: '0' }, h('div', { class: 'wb-grid' }), world);
  const zoomLabel = h('span', { class: 'mono small' });

  const apply = () => {
    world.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.z})`;
    canvas.style.setProperty('--gx', `${v.x}px`); canvas.style.setProperty('--gy', `${v.y}px`); canvas.style.setProperty('--gs', `${24 * v.z}px`);
    zoomLabel.textContent = `${Math.round(v.z * 100)}%`;
  };
  const toWorld = (cx, cy) => { const r = canvas.getBoundingClientRect(); return { x: (cx - r.left - v.x) / v.z, y: (cy - r.top - v.y) / v.z }; };

  const cardEls = new Map();
  for (const c of wb.cards) {
    const el = c.ref ? refCard(c) : noteCard(c);
    if (!el) continue;
    el.style.transform = `translate(${c.x}px, ${c.y}px)`;
    cardEls.set(c.id, el);
    world.append(el);
    // flytta kort
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, textarea, [contenteditable="true"]')) return;
      e.stopPropagation();
      const start = { x: e.clientX, y: e.clientY, cx: c.x, cy: c.y };
      let moved = false;
      el.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const dx = (ev.clientX - start.x) / v.z, dy = (ev.clientY - start.y) / v.z;
        if (!moved && Math.hypot(dx, dy) < 3) return;
        moved = true; el.classList.add('moving');
        c.x = Math.round(start.cx + dx); c.y = Math.round(start.cy + dy);
        el.style.transform = `translate(${c.x}px, ${c.y}px)`;
        drawLinks();
      };
      const up = () => {
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up);
        el.classList.remove('moving');
        if (moved) { persist(); el._justMoved = true; setTimeout(() => (el._justMoved = false), 50); }
      };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up);
    });
  }

  function drawLinks() {
    svg.replaceChildren();
    const refCards = wb.cards.filter((c) => c.ref && cardEls.has(c.id));
    const seen = new Set();
    for (const a of refCards) {
      const rel = related(a.ref);
      for (const b of refCards) {
        if (a === b) continue;
        const key = [a.id, b.id].sort().join('|');
        if (seen.has(key)) continue;
        const r = rel.find((x) => sameRef(x.ref, b.ref));
        if (!r) continue;
        seen.add(key);
        const ea = cardEls.get(a.id), eb = cardEls.get(b.id);
        const ax = a.x + ea.offsetWidth / 2, ay = a.y + ea.offsetHeight / 2, bx = b.x + eb.offsetWidth / 2, by = b.y + eb.offsetHeight / 2;
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const mx = (ax + bx) / 2;
        p.setAttribute('d', `M${ax},${ay} C${mx},${ay} ${mx},${by} ${bx},${by}`);
        p.setAttribute('class', r.relId ? 'rel' : 'rel structural');
        svg.append(p);
      }
    }
  }

  // panorera
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (e.target.closest('.wb-card')) return;
    const s = { x: e.clientX, y: e.clientY, vx: v.x, vy: v.y };
    canvas.setPointerCapture(e.pointerId); canvas.classList.add('panning');
    const move = (ev) => { v.x = s.vx + ev.clientX - s.x; v.y = s.vy + ev.clientY - s.y; apply(); };
    const up = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.classList.remove('panning'); saveView(); };
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up);
  });
  const zoomAt = (factor, cx, cy) => {
    const r = canvas.getBoundingClientRect();
    const px = cx ?? r.left + r.width / 2, py = cy ?? r.top + r.height / 2;
    const w = toWorld(px, py);
    v.z = Math.max(0.3, Math.min(2.2, v.z * factor));
    v.x = px - r.left - w.x * v.z; v.y = py - r.top - w.y * v.z;
    apply(); saveView();
  };
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * 0.0025), e.clientX, e.clientY);
    else { v.x -= e.deltaX; v.y -= e.deltaY; apply(); saveView(); }
  }, { passive: false });
  canvas.addEventListener('dblclick', (e) => {
    if (e.target.closest('.wb-card')) return;
    const p = toWorld(e.clientX, e.clientY);
    addNote(p.x - 110, p.y - 40);
  });
  canvas.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.wb-card')) return;
    e.preventDefault();
    const p = toWorld(e.clientX, e.clientY);
    contextMenu(e.clientX, e.clientY, [
      { label: 'Ny anteckning här', icon: 'note', action: () => addNote(p.x, p.y) },
      { label: 'Centrera innehåll', icon: 'target', action: fit },
      { label: 'Återställ zoom', icon: 'zoomOut', action: () => { v.z = 1; apply(); saveView(); } }
    ]);
  });

  dropTarget(canvas, {
    accept: (src) => !!src.ref && src.ref.t !== 'tool' && !wb.cards.some((c) => sameRef(c.ref, src.ref)),
    label: (src) => `Skapa referenskort för ${labelOf(src.ref)}`,
    onDrop: (src, e) => { const p = toWorld(e.clientX, e.clientY); addToWhiteboard(src.ref, { x: p.x - 120, y: p.y - 30 }); }
  });

  function addNote(x, y) {
    mutate('Anteckning på whiteboard', () => wb.cards.push({ id: uid('wb'), note: '', x: Math.round(x), y: Math.round(y), color: COLORS[wb.cards.length % COLORS.length], fresh: true }), { kind: 'whiteboard', silent: true });
  }

  function fit() {
    if (!wb.cards.length) return;
    const r = canvas.getBoundingClientRect();
    const xs = wb.cards.map((c) => c.x), ys = wb.cards.map((c) => c.y);
    const minX = Math.min(...xs), minY = Math.min(...ys), maxX = Math.max(...xs) + 260, maxY = Math.max(...ys) + 160;
    v.z = Math.max(0.3, Math.min(1.2, Math.min(r.width / (maxX - minX + 80), r.height / (maxY - minY + 80))));
    v.x = (r.width - (maxX - minX) * v.z) / 2 - minX * v.z; v.y = (r.height - (maxY - minY) * v.z) / 2 - minY * v.z;
    world.classList.add('animating'); apply(); setTimeout(() => world.classList.remove('animating'), 260); saveView();
  }

  const toolbar = h('div', { class: 'wb-toolbar' },
    h('button', { class: 'btn sm', onclick: () => { const r = canvas.getBoundingClientRect(); const p = toWorld(r.left + r.width / 2, r.top + r.height / 2); addNote(p.x - 110, p.y - 40); } }, icon('note', 14), 'Anteckning'),
    h('span', { class: 'sep' }),
    h('button', { class: 'iconbtn', title: 'Zooma ut', onclick: () => zoomAt(1 / 1.2) }, icon('zoomOut', 15)), zoomLabel,
    h('button', { class: 'iconbtn', title: 'Zooma in', onclick: () => zoomAt(1.2) }, icon('zoomIn', 15)),
    h('button', { class: 'iconbtn', title: 'Anpassa till innehåll (F)', onclick: fit }, icon('maximize', 15)),
    h('span', { class: 'sep' }),
    h('button', { class: 'iconbtn', title: 'Rensa whiteboarden', onclick: async () => {
      if (!wb.cards.length) return;
      if (await confirmDialog({ title: 'Rensa whiteboarden?', text: `Alla ${wb.cards.length} kort tas bort från whiteboarden. Själva informationen ligger kvar.`, okLabel: 'Rensa', danger: true })) {
        mutate('Whiteboard rensad', () => { wb.cards = []; }, { kind: 'whiteboard' });
        toast('Whiteboarden rensades', { action: { label: 'Ångra', fn: () => import('../store.js').then((m) => m.undo()) } });
      }
    } }, icon('trash', 15)));

  root.replaceChildren(h('div', { class: 'view view-whiteboard' },
    h('div', { class: 'view-head compact' }, h('div', h('h1', 'Whiteboard'), h('p', { class: 'muted' }, 'Dra information hit från listor eller kontextpanelen. Dubbelklicka för en anteckning, dra i bakgrunden för att panorera, Ctrl + scroll för att zooma. Linjer visar kopplingar.')), toolbar),
    canvas,
    !wb.cards.length && h('div', { class: 'wb-empty' }, icon('board', 26), h('b', 'Tom whiteboard'), h('span', 'Dra ett arbetspaket, ett ärende eller en ritning hit.'))));
  apply();
  requestAnimationFrame(() => {
    drawLinks();
    const fresh = wb.cards.find((c) => c.fresh);
    if (fresh) { delete fresh.fresh; cardEls.get(fresh.id)?.querySelector('textarea')?.focus(); }
  });
  canvas._fit = fit;
}

function refCard(c) {
  const e = get(c.ref);
  if (!e) return null;
  const st = statusOf(c.ref, e);
  const el = h('div', { class: `wb-card ref ti-${c.ref.t}`, dataset: { ref: `${c.ref.t}:${c.ref.id}` } },
    h('div', { class: 'wb-card-top' }, h('span', { class: `type-tag ti-${c.ref.t}` }, typeIcon(c.ref.t, 12), TYPES[c.ref.t].label), h('span', { class: 'grow' }),
      h('button', { class: 'iconbtn xs', title: 'Ta bort från whiteboard', onclick: () => removeCard(c) }, icon('x', 12))),
    h('div', { class: 'wb-title' }, h('b', { class: 'mono' }, codeOf(c.ref, e)), ' ', titleOf(c.ref, e).replace(codeOf(c.ref, e), '').trim()),
    h('div', { class: 'wb-meta' }, st && badge(st), e.due && dueChip(e.due, ['done', 'resolved', 'closed'].includes(e.status)), c.ref.t === 'model' && h('span', { class: 'mono chip' }, `v${latestVersion(e)?.v}`), h('span', { class: 'grow' }), e.responsible && avatar(e.responsible, 18)));
  el.addEventListener('click', (ev) => { if (el._justMoved || ev.target.closest('button')) return; ev.shiftKey ? app.openFloat(c.ref) : app.select(c.ref); });
  el.addEventListener('dblclick', () => app.open(c.ref));
  el.addEventListener('contextmenu', (ev) => { ev.preventDefault(); contextMenu(ev.clientX, ev.clientY, [...entityMenu(c.ref).filter((x) => x.label !== 'Lägg på whiteboard'), { divider: true }, { label: 'Ta bort från whiteboard', icon: 'x', action: () => removeCard(c) }]); });
  if (sameRef(app.selection, c.ref)) el.classList.add('selected');
  return el;
}

function noteCard(c) {
  const ta = h('textarea', { class: 'wb-note-text', placeholder: 'Skriv…', rows: 3 });
  ta.value = c.note || '';
  const fit = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
  ta.addEventListener('input', () => { c.note = ta.value; fit(); persist(); });
  requestAnimationFrame(fit);
  const el = h('div', { class: `wb-card note c-${c.color || 'amber'}` },
    h('div', { class: 'wb-card-top' }, icon('grip', 14, 'grip'), h('span', { class: 'grow' }),
      h('button', { class: 'iconbtn xs', title: 'Byt färg', onclick: () => { c.color = COLORS[(COLORS.indexOf(c.color) + 1) % COLORS.length]; persist(); emit('change', { type: 'whiteboard' }); } }, h('i', { class: 'color-dot' })),
      h('button', { class: 'iconbtn xs', title: 'Ta bort', onclick: () => removeCard(c) }, icon('x', 12))),
    ta);
  return el;
}

function removeCard(c) {
  const wb = store.db.whiteboard;
  mutate('Kort borttaget från whiteboard', () => { wb.cards = wb.cards.filter((x) => x.id !== c.id); }, { kind: 'whiteboard', silent: true });
  toast('Kortet togs bort', { action: { label: 'Ångra', fn: () => import('../store.js').then((m) => m.undo()) } });
}

export function keys(e, root) {
  if (e.key === 'f' || e.key === 'F') { root.querySelector('.wb-canvas')?._fit?.(); return true; }
  return false;
}
