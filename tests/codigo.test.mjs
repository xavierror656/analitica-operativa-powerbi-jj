import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { conectarCodigo } from '../src/lib/copiar-codigo.mjs';

test('copiar: conserva caracteres y saltos; cada botón copia su bloque sin encabezado', async () => {
  const dom = new JSDOM('<pre data-language="powerquery"><code>let\n x = <span>"Í &amp; &lt;"</span>\nin x</code></pre><pre data-language="dax"><code>Total = SUM(Tabla[Valor])</code></pre>');
  const { window } = dom, { document } = window;
  const copias = [];
  Object.defineProperty(window.navigator, 'clipboard', {value:{writeText: async texto => copias.push(texto)}});
  conectarCodigo({document,window});
  conectarCodigo({document,window});
  const botones = document.querySelectorAll('button');
  assert.equal(botones.length, 2);
  assert.equal(document.querySelector('.codigo-cabecera span').textContent, 'Power Query · M');
  for (const boton of botones) {
    boton.click();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(boton.textContent, '✓ Copiado');
    assert.equal(boton.disabled, false);
  }
  assert.deepEqual(copias, ['let\n x = "Í & <"\nin x', 'Total = SUM(Tabla[Valor])']);
  let navegaciones = 0;
  document.addEventListener('keydown', () => navegaciones++);
  botones[0].dispatchEvent(new window.KeyboardEvent('keydown', {key:'Enter', bubbles:true}));
  document.querySelector('pre').dispatchEvent(new window.KeyboardEvent('keydown', {key:'ArrowRight', bubbles:true}));
  assert.equal(navegaciones, 0);
  window.close();
});

test('copiar: informa el bloqueo y permite copiar manualmente o reintentar', async () => {
  const dom = new JSDOM('<pre data-language="dax"><code>% = DIVIDE([A], [B])</code></pre>');
  const { window } = dom, { document } = window;
  conectarCodigo({document,window});
  const boton = document.querySelector('button');
  boton.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(window.getSelection().toString(), '% = DIVIDE([A], [B])');
  assert.match(document.querySelector('[role=status]').textContent, /Ctrl\+C/);
  assert.equal(boton.textContent, 'Reintentar copia');
  Object.defineProperty(window.navigator, 'clipboard', {value:{writeText: async () => {}}});
  boton.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(boton.textContent, '✓ Copiado');
  assert.equal(document.querySelector('.codigo-error'), null);
  window.close();
});

test('sitio generado: recetas M, medidas DAX y Python mantienen el código y resaltado', () => {
  const recetas = JSON.parse(readFileSync('src/data/dia-01-pasos.json','utf8')).filter(r => r.formula);
  const guia = new JSDOM(readFileSync('dist/dia-01/guia/index.html','utf8'));
  const formulas = [...guia.window.document.querySelectorAll('pre[data-language=powerquery] code')];
  for (const receta of recetas) assert.ok(formulas.some(c => c.textContent === receta.formula), receta.id);
  guia.window.close();
  for(const [ruta, lenguaje] of [['dia-01','powerquery'], ['dia-03','dax'], ['dia-05','python'], ['practicas/3-1','dax']]) {
    const dom = new JSDOM(readFileSync(`dist/${ruta}/index.html`,'utf8'));
    const code = dom.window.document.querySelector(`pre[data-language=${lenguaje}] code`);
    assert.ok(code, ruta);
    assert.ok(code.querySelector('span[style*="color"]'), `Resaltado en ${ruta}`);
    conectarCodigo({document:dom.window.document,window:dom.window});
    assert.ok(code.closest('.codigo-bloque').querySelector('button'), `Copiar en ${ruta}`);
    dom.window.close();
  }
});
