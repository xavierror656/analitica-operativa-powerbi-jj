/** Comprueba el artefacto que Pages publicará en el dominio de producción. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const origin = 'https://powerbi.floresjavier.com';
const files = fs.readdirSync(dist, { recursive: true }).filter(name => fs.statSync(path.join(dist, name)).isFile());
const pages = files.filter(name => name.endsWith('.html'));
assert.ok(pages.length >= 28, 'Faltan páginas del curso');
assert.equal(fs.readFileSync(path.join(dist, 'CNAME'), 'utf8').trim(), new URL(origin).hostname);
let references = 0;

function checkReference(href, page) {
  if (/^(?:#|data:|mailto:|tel:)/.test(href)) return;
  const url = new URL(href.replaceAll('&amp;', '&'), new URL(page, origin));
  if (url.origin !== origin) return;
  assert.ok(!url.pathname.startsWith('/analitica-operativa-powerbi-jj/'), `Prefijo antiguo: ${page} → ${href}`);
  const local = path.resolve(dist, '.' + decodeURIComponent(url.pathname));
  assert.ok(local.startsWith(dist + path.sep) || local === dist, `Fuera de dist: ${href}`);
  assert.ok(fs.existsSync(local), `Recurso inexistente: ${page} → ${href}`);
  if (fs.statSync(local).isDirectory()) {
    assert.ok(fs.existsSync(path.join(local, 'index.html')), `Directorio sin página: ${href}`);
  }
  references++;
}

for (const file of pages) {
  const html = fs.readFileSync(path.join(dist, file), 'utf8');
  const route = '/' + file.replaceAll(path.sep, '/').replace(/index\.html$/, '');
  assert.match(html, /<html lang="es"/);
  assert.match(html, /name="viewport"/);
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) checkReference(href, route);
  assert.ok(/<style(?:\s|>)|<link[^>]+rel="stylesheet"/.test(html), `Sin estilos: ${route}`);
}

const cssFiles = files.filter(name => name.endsWith('.css'));
const css = cssFiles.map(file => fs.readFileSync(path.join(dist, file), 'utf8')).join('\n');
for (const font of ['titulo', 'cuerpo', 'codigo']) {
  assert.ok(css.includes(`.font-${font}{`), `Falta la utilidad de tipografía: font-${font}`);
}
for (const file of cssFiles) {
  const source = fs.readFileSync(path.join(dist, file), 'utf8');
  for (const [, href] of source.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) {
    checkReference(href, '/' + file.replaceAll(path.sep, '/'));
  }
}
console.log(`${pages.length} páginas: ${references} enlaces y recursos internos válidos; dominio y tipografías correctos.`);
