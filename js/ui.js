// UI-primitiver: element, ikoner, popovers, menyer, dialoger, toasts, dra-och-släpp.
import { STATUS, PRIORITY, TYPES, parseDate, today, daysBetween, labelOf, codeOf, titleOf, refKey } from './store.js';

// ------------------------------------------------------------------ element
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { children.unshift(attrs); attrs = null; }
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  append(el, children);
  return el;
}
function append(el, children) {
  for (const c of children) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ------------------------------------------------------------------ ikoner
const P = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  gantt: 'M4 5h9M8 10h11M6 15h8M11 20h8',
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  drawing: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
  cube: 'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5',
  alert: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  check: 'M20 6 9 17l-5-5',
  checkCircle: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
  gavel: 'm14 13-7.5 7.5a2.1 2.1 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  paperclip: 'm21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l8.6-8.6A4 4 0 1 1 18 8.8l-8.6 8.6a2 2 0 0 1-2.8-2.8l8.5-8.5',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l4 2',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  board: 'M2 4h20v13H2zM8 21l4-4 4 4M6 8h5M6 12h3M14 8h4v5h-4z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6 6 18M6 6l12 12',
  chevR: 'm9 18 6-6-6-6', chevD: 'm6 9 6 6 6-6', chevL: 'm15 18-6-6 6-6', chevU: 'm18 15-6-6-6 6',
  filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
  star: 'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.1 2 9.3l6.9-1z',
  pin: 'M12 17v5M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V17h14v-1.8a2 2 0 0 0-1.1-1.8l-1.8-.9a2 2 0 0 1-1.1-1.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
  external: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  refresh: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
  maximize: 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16v-4M12 8h.01',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  copy: 'M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  note: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  trash: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  sidebar: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18',
  panelR: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM15 3v18',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  file: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6',
  dots: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  back: 'M19 12H5M12 19l-7-7 7-7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  layers: 'm12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5',
  keyboard: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10',
  grip: 'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8',
  bolt: 'M13 2 3 14h9l-1 8 10-12h-9z',
  server: 'M2 3h20v8H2zM2 13h20v8H2zM6 7h.01M6 17h.01',
  window: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18',
  minus: 'M5 12h14',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  sparkle: 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z',
  kanban: 'M4 3h4v14H4zM10 3h4v9h-4zM16 3h4v18h-4z',
  zoomIn: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3M11 8v6M8 11h6',
  zoomOut: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3M8 11h6',
  play: 'M6 3l14 9-14 9z'
};
export function icon(name, size = 16, cls = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('class', `ic ${cls}`);
  s.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', P[name] || P.dots);
  s.append(p);
  return s;
}
export const typeIcon = (t, size = 14) => icon(TYPES[t]?.icon || 'dots', size, `ti ti-${t}`);
export function docIcon(kind) { return { email: 'mail', photo: 'image', pdf: 'file', ifc: 'cube', cad: 'drawing' }[kind] || 'paperclip'; }

// ------------------------------------------------------------------ format
const MON = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
export function fmtDate(s, withYear = false) {
  const d = typeof s === 'string' ? parseDate(s.slice(0, 10)) : s;
  if (!d || isNaN(d)) return '–';
  return `${d.getDate()} ${MON[d.getMonth()]}${withYear ? ' ' + d.getFullYear() : ''}`;
}
export function relDays(s) {
  if (!s) return '';
  const n = daysBetween(today(), parseDate(s.slice(0, 10)));
  if (n === 0) return 'idag';
  if (n === 1) return 'imorgon';
  if (n === -1) return 'igår';
  return n > 0 ? `om ${n} d` : `${-n} d sen`;
}
export function ago(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return 'nyss';
  if (s < 3600) return `${Math.floor(s / 60)} min sedan`;
  if (s < 86400) return `${Math.floor(s / 3600)} h sedan`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d sedan`;
  return fmtDate(iso);
}
export function fmtSize(n) {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} kB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
export function initials(name) { return String(name || '?').replace(/\./g, '').split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase(); }
export function hueOf(str) { let h = 0; for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }

// ------------------------------------------------------------------ små komponenter
export function badge(status, extraCls = '') {
  const s = STATUS[status];
  if (!s) return null;
  return h('span', { class: `badge tone-${s.tone} ${extraCls}` }, h('i', { class: 'dot' }), s.label);
}
export function prioBadge(p) {
  const s = PRIORITY[p];
  if (!s) return null;
  return h('span', { class: `prio prio-${p}`, title: `Prioritet: ${s.label}` }, h('i'), h('i'), h('i'), h('span', { class: 'sr' }, s.label));
}
export function avatar(name, size = 20) {
  return h('span', { class: 'avatar', title: name, style: { width: size + 'px', height: size + 'px', '--h': hueOf(name), fontSize: Math.round(size * 0.42) + 'px' } }, initials(name));
}
export function progressBar(pct, tone = '') {
  return h('span', { class: `pbar ${tone}`, title: `${pct}%` }, h('i', { style: { width: Math.max(0, Math.min(100, pct)) + '%' } }));
}
export function ring(pct, size = 36) {
  const r = (size - 5) / 2, c = 2 * Math.PI * r;
  const wrap = h('span', { class: 'ring', style: { width: size + 'px', height: size + 'px' } });
  wrap.innerHTML = `<svg viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg><b>${pct}</b>`;
  return wrap;
}
export function kbd(...keys) { return h('span', { class: 'kbds' }, keys.map((k) => h('kbd', k))); }
export function dueChip(s, done = false) {
  if (!s) return null;
  const n = daysBetween(today(), parseDate(s));
  const tone = done ? 'muted' : n < 0 ? 'bad' : n <= 2 ? 'warn' : 'muted';
  return h('span', { class: `due tone-${tone}`, title: fmtDate(s, true) }, icon('clock', 12), relDays(s));
}
export function emptyState(title, text, action) {
  return h('div', { class: 'empty' }, h('div', { class: 'empty-art' }, icon('sparkle', 22)), h('b', title), text && h('p', text), action);
}
export function skeleton(rows = 6) {
  return h('div', { class: 'skeleton' }, Array.from({ length: rows }, (_, i) => h('i', { style: { width: 60 + ((i * 37) % 40) + '%' } })));
}

/** Rad/chip för en entitet – dragbar, klickbar, högerklickbar. */
export function refChip(ref, opts = {}) {
  const code = codeOf(ref), title = titleOf(ref);
  const el = h('span', { class: `refchip ${opts.cls || ''}`, title: labelOf(ref), dataset: { ref: refKey(ref) } },
    typeIcon(ref.t, 12), code && h('b', code), h('span', title.replace(code, '').trim() || title));
  return el;
}

// ------------------------------------------------------------------ fokus & scroll
export function preserve(root, fn) {
  const a = document.activeElement;
  const key = a && root.contains(a) ? a.dataset.fkey : null;
  const sel = key && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null;
  const scrolls = $$('[data-skey]', root).map((e) => [e.dataset.skey, e.scrollTop, e.scrollLeft]);
  const rootScroll = [root.scrollTop, root.scrollLeft];
  fn();
  root.scrollTop = rootScroll[0]; root.scrollLeft = rootScroll[1];
  for (const [k, t, l] of scrolls) { const e = $(`[data-skey="${k}"]`, root); if (e) { e.scrollTop = t; e.scrollLeft = l; } }
  if (key) {
    const n = $(`[data-fkey="${key}"]`, root);
    if (n) { n.focus({ preventScroll: true }); if (sel) try { n.setSelectionRange(...sel); } catch {} }
  }
}

// ------------------------------------------------------------------ overlay-stack (Esc stänger översta)
const stack = [];
export function pushOverlay(close) { stack.push(close); return () => { const i = stack.indexOf(close); if (i >= 0) stack.splice(i, 1); }; }
export function closeTopOverlay() { const c = stack.pop(); if (c) { c(); return true; } return false; }
export function hasOverlay() { return stack.length > 0; }

// ------------------------------------------------------------------ popover
export function popover(anchor, content, { align = 'start', cls = '', offset = 6, onClose, x, y } = {}) {
  const layer = $('#layer');
  const el = h('div', { class: `popover ${cls}` }, content);
  layer.append(el);
  const place = () => {
    const pw = el.offsetWidth, ph = el.offsetHeight, vw = innerWidth, vh = innerHeight;
    let left, top;
    if (anchor) {
      const r = anchor.getBoundingClientRect();
      left = align === 'end' ? r.right - pw : r.left;
      top = r.bottom + offset;
      if (top + ph > vh - 8) top = Math.max(8, r.top - ph - offset);
    } else { left = x; top = y; if (top + ph > vh - 8) top = Math.max(8, vh - ph - 8); }
    left = Math.max(8, Math.min(left, vw - pw - 8));
    el.style.left = left + 'px'; el.style.top = top + 'px';
  };
  place();
  requestAnimationFrame(() => el.classList.add('open'));
  let closed = false;
  const close = () => {
    if (closed) return; closed = true;
    removeOverlay(); document.removeEventListener('pointerdown', outside, true); removeEventListener('resize', close);
    el.classList.remove('open'); el.classList.add('closing');
    setTimeout(() => el.remove(), 130);
    anchor?.classList.remove('is-open');
    onClose?.();
  };
  const outside = (e) => { if (!el.contains(e.target) && !anchor?.contains(e.target)) close(); };
  setTimeout(() => document.addEventListener('pointerdown', outside, true));
  addEventListener('resize', close);
  const removeOverlay = pushOverlay(close);
  anchor?.classList.add('is-open');
  return { el, close, place };
}

/** Sökbar fler- eller enkelvalslista. options: [{value,label,hint,color,icon}] */
export function selectList({ options, selected = [], multi = true, searchable = options.length > 7, placeholder = 'Sök…', onChange, onCommit, emptyText = 'Inga träffar' }) {
  const sel = new Set(selected);
  let q = '', active = 0, filtered = options;
  const input = searchable ? h('input', { class: 'sl-search', placeholder, spellcheck: 'false' }) : null;
  const list = h('div', { class: 'sl-list', role: 'listbox' });
  const render = () => {
    const n = norm(q);
    filtered = options.filter((o) => !n || norm(o.label + ' ' + (o.hint || '')).includes(n));
    active = Math.min(active, Math.max(0, filtered.length - 1));
    list.replaceChildren(...(filtered.length ? filtered.map((o, i) => h('div', {
      class: `sl-opt ${sel.has(o.value) ? 'on' : ''} ${i === active ? 'act' : ''}`, role: 'option',
      onpointerenter: () => { active = i; mark(); },
      onclick: () => toggle(o)
    },
    multi ? h('span', { class: 'cbox' }, icon('check', 12)) : h('span', { class: 'rdot' }),
    o.color && h('i', { class: 'swatch', style: { background: o.color } }),
    o.icon && icon(o.icon, 14),
    h('span', { class: 'sl-label' }, o.label),
    o.hint && h('span', { class: 'sl-hint' }, o.hint))) : [h('div', { class: 'sl-empty' }, emptyText)]));
  };
  const mark = () => $$('.sl-opt', list).forEach((e, i) => e.classList.toggle('act', i === active));
  const toggle = (o) => {
    if (multi) { sel.has(o.value) ? sel.delete(o.value) : sel.add(o.value); }
    else { sel.clear(); sel.add(o.value); }
    render();
    onChange?.([...sel]);
    if (!multi) onCommit?.(o.value);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { active = Math.min(filtered.length - 1, active + 1); mark(); scrollAct(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); mark(); scrollAct(); e.preventDefault(); }
    else if (e.key === 'Enter') { const o = filtered[active]; if (o) toggle(o); e.preventDefault(); }
  };
  const scrollAct = () => $('.sl-opt.act', list)?.scrollIntoView({ block: 'nearest' });
  input?.addEventListener('input', () => { q = input.value; active = 0; render(); });
  const root = h('div', { class: 'selectlist', tabindex: '-1', onkeydown: onKey }, input, list);
  render();
  setTimeout(() => (input || root).focus(), 20);
  return { el: root, get value() { return [...sel]; }, set(v) { sel.clear(); v.forEach((x) => sel.add(x)); render(); } };
}
export function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

/** Knapp som öppnar en selectList. */
export function dropdown({ label, iconName, options, value, multi = false, onChange, cls = '', title, footer }) {
  const btn = h('button', { class: `dd ${cls}`, type: 'button', title });
  const paint = () => {
    const v = Array.isArray(value) ? value : value == null ? [] : [value];
    const lab = !v.length ? label : multi ? (v.length === 1 ? options.find((o) => o.value === v[0])?.label : `${v.length} valda`) : options.find((o) => o.value === v[0])?.label;
    btn.replaceChildren(iconName ? icon(iconName, 14) : '', h('span', { class: 'dd-label' }, multi && v.length ? [h('span', { class: 'dd-key' }, label + ':'), ' ', lab] : (lab || label)), icon('chevD', 14, 'dd-chev'));
    btn.classList.toggle('has-value', multi && v.length > 0);
  };
  paint();
  btn.addEventListener('click', () => {
    let pop;
    const sl = selectList({
      options, multi, selected: Array.isArray(value) ? value : value == null ? [] : [value],
      onChange: (v) => { if (multi) { value = v; paint(); onChange?.(v); } },
      onCommit: (v) => { value = v; paint(); onChange?.(v); pop.close(); }
    });
    pop = popover(btn, [sl.el, footer && footer(() => pop.close())], { cls: 'pop-select' });
  });
  return btn;
}

// ------------------------------------------------------------------ högerklicksmeny
export function contextMenu(x, y, items) {
  let pop, sub;
  const build = (list, isSub = false) => h('div', { class: 'menu', role: 'menu' }, list.filter(Boolean).map((it) => {
    if (it.divider) return h('div', { class: 'menu-div' });
    if (it.header) return h('div', { class: 'menu-head' }, it.header);
    const row = h('button', {
      class: `menu-item ${it.danger ? 'danger' : ''} ${it.submenu ? 'has-sub' : ''}`, type: 'button', disabled: it.disabled, role: 'menuitem',
      onclick: (e) => {
        if (it.submenu) return openSub(row, it.submenu);
        closeAll(); it.action?.(e);
      },
      onpointerenter: () => { if (it.submenu) openSub(row, it.submenu); else if (!isSub) { sub?.close(); sub = null; } }
    },
    h('span', { class: 'mi-ic' }, it.checked ? icon('check', 14) : it.icon ? icon(it.icon, 14) : null),
    h('span', { class: 'mi-label' }, it.label),
    it.kbd && h('span', { class: 'mi-kbd' }, it.kbd),
    it.submenu && icon('chevR', 14, 'mi-sub'));
    return row;
  }));
  const openSub = (row, list) => {
    if (sub && sub.row === row) return;
    sub?.close();
    const r = row.getBoundingClientRect();
    sub = popover(null, build(list, true), { x: r.right + 2, y: r.top - 4, cls: 'pop-menu' });
    sub.row = row;
    if (r.right + 2 + sub.el.offsetWidth > innerWidth - 8) { sub.el.style.left = Math.max(8, r.left - sub.el.offsetWidth - 2) + 'px'; }
  };
  const closeAll = () => { sub?.close(); pop?.close(); };
  pop = popover(null, build(items), { x, y, cls: 'pop-menu', onClose: () => sub?.close() });
  const first = $('.menu-item:not([disabled])', pop.el); first?.focus({ preventScroll: true });
  pop.el.addEventListener('keydown', (e) => {
    const btns = $$('.menu-item:not([disabled])', pop.el);
    const i = btns.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { btns[(i + 1) % btns.length]?.focus(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { btns[(i - 1 + btns.length) % btns.length]?.focus(); e.preventDefault(); }
  });
  return pop;
}

// ------------------------------------------------------------------ dialoger
export function modal({ title, subtitle, body, actions = [], width = 520, cls = '', onClose }) {
  const layer = $('#layer');
  const close = () => {
    removeOverlay();
    wrap.classList.remove('open'); wrap.classList.add('closing');
    setTimeout(() => wrap.remove(), 160);
    onClose?.();
  };
  const foot = actions.length ? h('div', { class: 'modal-foot' }, actions.map((a) => a.spacer ? h('span', { class: 'grow' }) : h('button', {
    class: `btn ${a.primary ? 'primary' : ''} ${a.danger ? 'danger' : ''} ${a.ghost ? 'ghost' : ''}`, type: 'button', disabled: a.disabled,
    onclick: async () => { const r = await a.onClick?.(); if (r !== false) close(); }
  }, a.icon && icon(a.icon, 14), a.label, a.kbd && h('kbd', a.kbd)))) : null;
  const box = h('div', { class: `modal ${cls}`, style: { width: `min(${width}px, calc(100vw - 32px))` }, role: 'dialog', 'aria-modal': 'true' },
    h('div', { class: 'modal-head' }, h('div', h('h2', title), subtitle && h('p', subtitle)), h('button', { class: 'iconbtn', onclick: close, title: 'Stäng (Esc)' }, icon('x', 16))),
    h('div', { class: 'modal-body' }, body), foot);
  const wrap = h('div', { class: 'modal-wrap', onpointerdown: (e) => { if (e.target === wrap) close(); } }, box);
  layer.append(wrap);
  requestAnimationFrame(() => wrap.classList.add('open'));
  const removeOverlay = pushOverlay(close);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { $('.modal-foot .btn.primary', box)?.click(); e.preventDefault(); }
  });
  setTimeout(() => ($('input,textarea,select', box) || box).focus?.(), 40);
  return { el: box, close };
}
export function confirmDialog({ title, text, okLabel = 'Bekräfta', danger = false }) {
  return new Promise((resolve) => {
    let done = false;
    const m = modal({
      title, body: h('p', { class: 'confirm-text' }, text), width: 420,
      actions: [
        { spacer: true },
        { label: 'Avbryt', ghost: true, onClick: () => { done = true; resolve(false); } },
        { label: okLabel, primary: !danger, danger, onClick: () => { done = true; resolve(true); } }
      ],
      onClose: () => { if (!done) resolve(false); }
    });
    setTimeout(() => $('.modal-foot .btn:last-child', m.el)?.focus(), 50);
  });
}

/** Formulärdialog. fields: [{key,label,type,options,value,required,placeholder,full}] */
export function formDialog({ title, subtitle, fields, okLabel = 'Spara', width = 560 }) {
  return new Promise((resolve) => {
    let done = false;
    const inputs = {};
    const grid = h('div', { class: 'form-grid' }, fields.map((f) => {
      let input;
      if (f.type === 'select') {
        input = h('select', { class: 'input' }, (f.options || []).map((o) => {
          const opt = typeof o === 'object' ? o : { value: o, label: o };
          return h('option', { value: opt.value, selected: String(opt.value) === String(f.value ?? '') }, opt.label);
        }));
      } else if (f.type === 'textarea') {
        input = h('textarea', { class: 'input', rows: f.rows || 3, placeholder: f.placeholder || '' });
        input.value = f.value ?? '';
      } else {
        input = h('input', { class: 'input', type: f.type || 'text', placeholder: f.placeholder || '', list: f.list ? `dl-${f.key}` : null, min: f.min, max: f.max, step: f.step });
        input.value = f.value ?? '';
      }
      inputs[f.key] = input;
      return h('label', { class: `field ${f.full || f.type === 'textarea' ? 'full' : ''}` }, h('span', f.label, f.required && h('em', ' *')), input,
        f.list && h('datalist', { id: `dl-${f.key}` }, f.list.map((v) => h('option', { value: v }))));
    }));
    const collect = () => Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, el.type === 'number' ? (el.value === '' ? null : +el.value) : el.value.trim()]));
    modal({
      title, subtitle, body: grid, width,
      actions: [{ spacer: true }, { label: 'Avbryt', ghost: true }, {
        label: okLabel, primary: true, kbd: 'Ctrl ↵', onClick: () => {
          const v = collect();
          const missing = fields.find((f) => f.required && !v[f.key]);
          if (missing) { inputs[missing.key].classList.add('invalid'); inputs[missing.key].focus(); return false; }
          done = true; resolve(v);
        }
      }],
      onClose: () => { if (!done) resolve(null); }
    });
  });
}

// ------------------------------------------------------------------ toasts
export function toast(msg, { tone = 'info', action, iconName, timeout = 4200 } = {}) {
  const host = $('#toasts');
  const el = h('div', { class: `toast tone-${tone}`, role: 'status' },
    icon(iconName || ({ ok: 'checkCircle', bad: 'alert', warn: 'alert' }[tone] || 'info'), 16),
    h('span', { class: 'toast-msg' }, msg),
    action && h('button', { class: 'toast-act', onclick: () => { action.fn(); dismiss(); } }, action.label),
    h('button', { class: 'toast-x', onclick: () => dismiss(), title: 'Stäng' }, icon('x', 12)));
  host.append(el);
  requestAnimationFrame(() => el.classList.add('open'));
  let t = setTimeout(() => dismiss(), timeout);
  el.addEventListener('pointerenter', () => clearTimeout(t));
  el.addEventListener('pointerleave', () => { t = setTimeout(() => dismiss(), 1800); });
  function dismiss() { el.classList.remove('open'); el.classList.add('closing'); setTimeout(() => el.remove(), 180); }
  while (host.children.length > 4) host.firstElementChild.remove();
  return dismiss;
}

// ------------------------------------------------------------------ dra & släpp
// Interna entiteter dras med typen application/x-pch-ref. Släppmål markeras med
// data-drop och en egenskap el._drop = { accept(src), onDrop(src, e), label(src) },
// där src = { ref } eller { files, items }.
export const drag = { src: null };
const MIME_REF = 'application/x-pch-ref';

let ghost;
export function makeDraggable(el, ref, { label } = {}) {
  el.draggable = true;
  el.addEventListener('dragstart', (e) => {
    e.stopPropagation();
    drag.src = { ref };
    e.dataTransfer.effectAllowed = 'copyLink';
    e.dataTransfer.setData(MIME_REF, refKey(ref));
    e.dataTransfer.setData('text/plain', label || labelOf(ref));
    ghost?.remove();
    ghost = h('div', { class: 'drag-ghost' }, typeIcon(ref.t, 14), h('b', codeOf(ref)), h('span', titleOf(ref)));
    document.body.append(ghost);
    e.dataTransfer.setDragImage(ghost, 14, 14);
    requestAnimationFrame(() => startDrag());
  });
  el.addEventListener('dragend', endDrag);
}

export function dropTarget(el, spec) {
  el.dataset.drop = '1';
  el._drop = spec;
  el.addEventListener('dragenter', (e) => { if (accepts(el)) { e.preventDefault(); el.classList.add('drop-over'); } });
  el.addEventListener('dragover', (e) => {
    if (!accepts(el)) return;
    e.preventDefault(); e.stopPropagation();
    e.dataTransfer.dropEffect = drag.src?.ref ? 'link' : 'copy';
    el.classList.add('drop-over');
    showHint(e, spec.label?.(drag.src) || 'Släpp här');
  });
  el.addEventListener('dragleave', (e) => { if (!el.contains(e.relatedTarget)) { el.classList.remove('drop-over'); hideHint(); } });
  el.addEventListener('drop', (e) => {
    if (!accepts(el)) return;
    e.preventDefault(); e.stopPropagation();
    const src = drag.src?.ref ? drag.src : {
      files: [...(e.dataTransfer.files || [])],
      // webkitGetAsEntry måste anropas synkront under drop-händelsen
      entries: [...(e.dataTransfer.items || [])].map((it) => it.webkitGetAsEntry?.()).filter(Boolean)
    };
    el.classList.remove('drop-over');
    endDrag();
    spec.onDrop(src, e);
  });
}
function accepts(el) {
  const src = drag.src || (drag.files ? { files: true } : null);
  if (!src) return false;
  try { return !!el._drop?.accept(src); } catch { return false; }
}
function startDrag() {
  document.body.classList.add('is-dragging');
  $$('[data-drop]').forEach((t) => t.classList.toggle('drop-ok', accepts(t)));
}
export function endDrag() {
  drag.src = null; drag.files = false;
  document.body.classList.remove('is-dragging', 'is-dragging-files');
  $$('.drop-ok, .drop-over').forEach((t) => t.classList.remove('drop-ok', 'drop-over'));
  hideHint();
  ghost?.remove(); ghost = null;
}
let hintEl;
function showHint(e, text) {
  if (!hintEl) { hintEl = h('div', { class: 'drop-hint' }); document.body.append(hintEl); }
  hintEl.textContent = text;
  hintEl.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 18}px)`;
  hintEl.classList.add('show');
}
function hideHint() { hintEl?.classList.remove('show'); }

// Filer från operativsystemet
let fileDepth = 0;
addEventListener('dragenter', (e) => {
  if (drag.src || !e.dataTransfer?.types?.includes('Files')) return;
  fileDepth++;
  if (!drag.files) { drag.files = true; document.body.classList.add('is-dragging', 'is-dragging-files'); $$('[data-drop]').forEach((t) => t.classList.toggle('drop-ok', accepts(t))); }
});
addEventListener('dragleave', () => { if (drag.files && --fileDepth <= 0) { fileDepth = 0; endDrag(); } });
addEventListener('dragover', (e) => { if (drag.files || drag.src) e.preventDefault(); });
addEventListener('drop', (e) => { e.preventDefault(); fileDepth = 0; endDrag(); });

/** Läs filer ur ett drop, inklusive mappar (webkitGetAsEntry). Returnerar [{file, path}] */
export async function readDropped(src) {
  const entries = src.entries || [];
  if (!entries.length) return (src.files || []).map((f) => ({ file: f, path: f.name }));
  const out = [];
  const walk = async (entry, prefix) => {
    if (entry.isFile) {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      out.push({ file, path: prefix + entry.name });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      let batch;
      do {
        batch = await new Promise((res, rej) => reader.readEntries(res, rej));
        for (const c of batch) await walk(c, prefix + entry.name + '/');
      } while (batch.length);
    }
  };
  for (const e of entries) await walk(e, '');
  return out;
}
