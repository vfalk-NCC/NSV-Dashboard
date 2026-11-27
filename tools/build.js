#!/usr/bin/env node
/*
 * Bygger js/app.bundle.js: alla ES-moduler i js/ samlade i ett vanligt skript.
 *
 * Varför: webbläsare blockerar ES-moduler när index.html öppnas direkt från disken
 * (file://). Paketet gör att appen ändå startar (i demoläge) om man dubbelklickar
 * på index.html. Med servern (start.bat) används modulerna direkt.
 *
 * Inga beroenden. Kör: node tools/build.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY = 'js/main.js';
const OUT = path.join(ROOT, 'js', 'app.bundle.js');

const mods = new Map();   // id -> kod
const order = [];

function resolve(from, spec) {
  if (!spec.startsWith('.')) throw new Error(`Bara relativa importer stöds: ${spec} i ${from}`);
  return path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
}

function transform(id, src) {
  const exported = [];
  const deps = new Set();
  // statiska importer (även flerradiga)
  src = src.replace(/^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*$/gm, (m, what, spec) => {
    const dep = resolve(id, spec); deps.add(dep);
    what = what.trim();
    const ns = what.match(/^\*\s+as\s+([\w$]+)$/);
    if (ns) return `const ${ns[1]} = __r(${JSON.stringify(dep)});`;
    const named = what.match(/^\{([\s\S]*)\}$/);
    if (named) {
      const parts = named[1].split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.replace(/^([\w$]+)\s+as\s+([\w$]+)$/, '$1: $2'));
      return `const { ${parts.join(', ')} } = __r(${JSON.stringify(dep)});`;
    }
    throw new Error(`Importformen stöds inte i ${id}: ${m}`);
  });
  if (/^import\s/m.test(src)) throw new Error(`Okänd import kvar i ${id}`);
  // dynamiska importer
  src = src.replace(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g, (m, spec) => {
    const dep = resolve(id, spec); deps.add(dep);
    return `Promise.resolve().then(() => __r(${JSON.stringify(dep)}))`;
  });
  // exporter
  src = src.replace(/^export\s+(async\s+function\*?|function\*?|const|let|class)\s+([\w$]+)/gm, (m, kw, name) => { exported.push(name); return `${kw} ${name}`; });
  if (/^export\s/m.test(src)) throw new Error(`Exportformen stöds inte i ${id}`);
  const getters = exported.map((n) => `${JSON.stringify(n)}: { get: () => ${n}, enumerable: true }`).join(',\n  ');
  return { code: `Object.defineProperties(exports, {\n  ${getters}\n});\n${src}`, deps };
}

function visit(id) {
  if (mods.has(id)) return;
  const file = path.join(ROOT, id);
  const t = transform(id, fs.readFileSync(file, 'utf8'));
  mods.set(id, t.code);
  for (const d of t.deps) visit(d);
  order.push(id);
}

visit(ENTRY);
const body = order.map((id) => `__defs[${JSON.stringify(id)}] = function (exports, __r) {\n${mods.get(id)}\n};`).join('\n\n');
const out = `/* Genererad av tools/build.js – redigera inte. Källkoden finns i js/. */
(function () {
'use strict';
const __defs = {}, __cache = {};
function __r(id) {
  if (__cache[id]) return __cache[id];
  const exports = __cache[id] = {};
  __defs[id](exports, __r);
  return exports;
}
${body}
__r(${JSON.stringify(ENTRY)});
})();
`;
fs.writeFileSync(OUT, out);
console.log(`js/app.bundle.js: ${order.length} moduler, ${(out.length / 1024).toFixed(0)} kB`);
