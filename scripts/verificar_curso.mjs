/** Contratos del material publicado. No ejecuta Power BI ni verifica su interfaz. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const exists = p => fs.existsSync(path.join(root, p));
const base = '/analitica-operativa-powerbi-jj';
const expectedTimes = [60, 90, 90, 90, 90, 30];

for (const day of [3, 4, 5]) {
  const slug = `dia-0${day}`;
  const page = read(`src/pages/${slug}.astro`);
  const blocks = page.split(/<!--[^>]+-->/).slice(1);
  assert.equal(blocks.length, 6, `${slug}: seis bloques`);
  let modules = 0;
  const totals = blocks.map(block => {
    let total = 0;
    for (const [, name] of block.matchAll(/<(M\d+)\s*\/>/g)) {
      const source = read(`src/components/${slug}/${name}.astro`);
      const notes = [...source.matchAll(/<Notas\s+slot="notas"\s+minutos=\{(\d+)\}/g)];
      assert.equal(notes.length, 1, `${slug}/${name}: notas únicas`);
      const minutes = Number(notes[0][1]);
      total += minutes;
      modules++;
      const activity = source.match(/<(?:TuTurno|Practica)\s[^>]*minutos=\{(\d+)\}/);
      if (activity) assert.equal(Number(activity[1]), minutes, `${slug}/${name}: timer`);
      if (day < 5) assert.doesNotMatch(source, /\bpython\b/i, `${slug}/${name}: reserva Día 5`);
    }
    return total;
  });
  assert.deepEqual(totals, expectedTimes, `${slug}: distribución de jornada`);
  assert.equal(modules, 33);
  const html = read(`dist/${slug}/index.html`);
  assert.equal([...html.matchAll(/<section(?:\s|>)/g)].length, 34, `${slug}: slides`);
  assert.equal([...html.matchAll(/<aside\s+class="notes"/g)].length, 34, `${slug}: notas renderizadas`);
  assert.equal([...html.matchAll(/class="quiz"/g)].length, day === 4 ? 3 : 2, `${slug}: quizzes`);
  const guide = read(`dist/${slug}/guia/index.html`);
  const download = read(`dist/descargas/guia-${slug}.md`);
  assert.ok(guide.includes(`evidencia A${day}`));
  assert.ok(download.includes('08:00–09:00') && download.includes('16:30–17:00'));
  if (day < 5) assert.doesNotMatch(html + guide + download, /\bpython\b/i);
  else assert.match(guide, /Python solo en el Día 5/);
  // Detectar enlaces internos rotos incluyendo rutas relativas de las guías.
  for (const [text, url] of [[html, `${base}/${slug}/`], [guide, `${base}/${slug}/guia/`]]) {
    for (const [, href] of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|data:|mailto:|#)/.test(href)) continue;
      const resolved = new URL(href, `https://curso.test${url}`);
      assert.ok(resolved.pathname.startsWith(`${base}/`), `Fuera de base: ${href}`);
      const relative = decodeURIComponent(resolved.pathname.slice(base.length + 1));
      assert.ok(exists(`dist/${relative}`) || exists(`dist/${relative}/index.html`), `Enlace roto: ${url} -> ${href}`);
    }
  }
  console.log(`${slug}: 34 slides, ${totals.reduce((a,b) => a+b)} min, guía y enlaces correctos`);
}

const medidas = JSON.parse(read('src/data/medidas-dia-03.json'));
assert.equal(new Set(medidas.map(m => m.nombre)).size, medidas.length);
assert.equal(medidas.filter(m => m.principal).length, 6);
const names = new Set(medidas.map(m => m.nombre));
const dax = read('dist/descargas/medidas-dia-03.dax');
for (const measure of medidas) {
  assert.ok(dax.includes(`${measure.nombre} =\n${measure.expresion}`), `Descarga: ${measure.nombre}`);
  // Referencias sin tabla: deben corresponder a otra medida del recetario.
  for (const [, name] of measure.expresion.matchAll(/(?<![\p{L}\p{N}_])\[([^\]]+)\]/gu)) {
    assert.ok(names.has(name), `Dependencia desconocida: ${name}`);
    assert.notEqual(name, measure.nombre, 'Autorreferencia');
  }
}
assert.equal(read('dist/descargas/calendario-dia-03.pq'), read('public/descargas/calendario-dia-03.pq'));
assert.equal(read('dist/descargas/verificar_cifras_dia05.py'), read('public/descargas/verificar_cifras_dia05.py'));
console.log(`Recetario: ${medidas.length} medidas, seis principales; recursos sin alteraciones`);
