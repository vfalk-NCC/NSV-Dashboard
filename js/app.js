// Delad app-yta som vyer och komponenter anropar. Fylls i av main.js.
export const app = {
  route: { view: 'overview', params: [] },
  selection: null,
  navigate: (hash) => { location.hash = hash; },
  select: () => {},
  open: () => {},
  openFloat: () => {},
  render: () => {},
  palette: () => {}
};

const LAYOUT_KEY = 'pch.layout.v1';
export const layout = (() => {
  const def = { nav: true, navW: 232, ctx: true, ctxW: 380, pinned: null, theme: 'dark', floats: [], density: 'comfortable' };
  try { return { ...def, ...JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}') }; } catch { return def; }
})();
export function saveLayout() { try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch {} }
