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
assert.equal(pages.length, 47, 'Se esperan las 44 páginas del curso, buscador, entregas y referencias');
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
  if (html.includes('class="reveal"')) {
    assert.ok(html.includes('class="deck-toolbar"'), `Falta navegación: ${route}`);
    assert.ok(html.includes('id="proyectar"'), `Falta proyección: ${route}`);
    assert.ok(html.includes(`href="${route}?print-pdf"`), `Falta exportación PDF: ${route}`);
    assert.ok(html.includes('id="deck-saved"') && html.includes('id="reiniciar-presentacion"'), `Falta control del avance: ${route}`);
    assert.ok(html.includes('target="_blank"'), `La guía debe conservar la presentación abierta: ${route}`);
  }
}

const fichas = JSON.parse(fs.readFileSync(path.join(root, 'src/data/practicas-aula.json'), 'utf8'));
assert.equal(Object.keys(fichas).length, 16);
for (const [id, ficha] of Object.entries(fichas)) {
  const guide = fs.readFileSync(path.join(dist, `practicas/${id}/guia/index.html`), 'utf8');
  const deck = fs.readFileSync(path.join(dist, `practicas/${id}/index.html`), 'utf8');
  assert.ok(guide.includes(`data-ficha="${id}"`) && guide.includes('data-caso="practicas"'));
  for (const key of ['objetivo', 'abre', 'construye', 'comprueba', 'entrega']) {
    assert.ok(ficha[key]?.length > 20, `${id}: falta ${key}`);
    const escaped = ficha[key].replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    assert.ok(guide.includes(escaped), `${id}: guía no muestra ${key}`);
    assert.ok(deck.includes(escaped), `${id}: diapositivas no muestran ${key}`);
  }
  if (!id.startsWith('5')) assert.doesNotMatch(guide + deck, /\bpython\b/i);
  assert.ok(!guide.includes('id="tu-entrega-paso-a-paso"'), `${id}: ficha duplicada`);
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
