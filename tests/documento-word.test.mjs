import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import JSZip from 'jszip';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { crearDocumentoWord } from '../src/lib/documento-word.mjs';

const xml = texto => new JSDOM(texto, { contentType: 'text/xml' }).window.document;
const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const nodos = (doc, tag) => [...doc.getElementsByTagNameNS(ns, tag)];
const parrafos = doc => nodos(doc, 'p').map(p => nodos(p, 't').map(t => t.textContent).join(''));

test('Word conserva fórmulas, caracteres, vínculos y casillas editables', async () => {
  const buffer = await crearDocumentoWord('# Guía\n\n**Validación**: á & < 3.\n\n- [ ] Pendiente\n\n[Fuente](https://example.com/?a=1&b=2)\n\n```powerquery\nif [x] < 3 then "Í & texto"\nelse null\n```');
  const zip = await JSZip.loadAsync(buffer);
  const doc = xml(await zip.file('word/document.xml').async('string'));
  const texto = parrafos(doc).join('\n');
  assert.ok(texto.includes('Validación: á & < 3.'));
  assert.ok(texto.includes('☐ Pendiente'));
  assert.ok(texto.includes('if [x] < 3 then "Í & texto"\nelse null'));
  const rels = xml(await zip.file('word/_rels/document.xml.rels').async('string'));
  assert.ok([...rels.getElementsByTagName('Relationship')].some(r => r.getAttribute('Target') === 'https://example.com/?a=1&b=2'));
});

test('descarga Word del día 1 contiene todas las recetas, tablas y fórmulas del Markdown', async () => {
  const zip = await JSZip.loadAsync(readFileSync('dist/descargas/guia-dia-01.docx'));
  const doc = xml(await zip.file('word/document.xml').async('string'));
  const markdown = readFileSync('dist/descargas/guia-dia-01.md', 'utf8');
  const tokens = marked.lexer(markdown);
  const texto = parrafos(doc).join('\n');
  for (const token of tokens.filter(t => t.type === 'code')) {
    assert.ok(texto.includes(token.text.replaceAll('\r\n', '\n')), `Fórmula preservada: ${token.text.slice(0, 50)}`);
  }
  const tablas = nodos(doc, 'tbl');
  assert.equal(tablas.length, tokens.filter(t => t.type === 'table').length);
  const bitacora = tablas.find(t => t.textContent.includes('Pendiente / responsable'));
  assert.ok(bitacora, 'Plantilla editable de bitácora');
  assert.equal(nodos(bitacora, 'tr').at(-1).textContent, '', 'Fila vacía para completar');
  const bookmarks = new Set(nodos(doc, 'bookmarkStart').map(b => b.getAttributeNS(ns, 'name')));
  const recetas = JSON.parse(readFileSync('src/data/dia-01-pasos.json', 'utf8'));
  for (const receta of recetas) {
    assert.ok(texto.includes(receta.titulo));
    assert.ok(bookmarks.has(`paso_${receta.id.replaceAll('-', '_')}`));
  }
  for (const link of nodos(doc, 'hyperlink')) {
    const anchor = link.getAttributeNS(ns, 'anchor');
    if (anchor) assert.ok(bookmarks.has(anchor), `Destino interno: ${anchor}`);
  }
  const deck = new JSDOM(readFileSync('dist/dia-01/index.html', 'utf8'));
  const slide = deck.window.document.querySelectorAll('.slides > section')[18];
  assert.ok(slide.querySelector('a[download][href="/descargas/guia-dia-01.docx"]'));
  deck.window.close();
});
