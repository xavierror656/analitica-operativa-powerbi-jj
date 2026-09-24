import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { conectarCurso } from '../src/lib/curso-personal.mjs';
import { conectarEntregas } from '../src/lib/entregas.mjs';
import { buscar } from '../src/lib/busqueda.mjs';

test('continuar rechaza rutas externas y posiciones inválidas', () => {
  for (const saved of [null, {version:1,pathname:'https://evil.example',h:1,v:0}, {version:1,pathname:'/dia-01/',h:-1,v:0}, {version:1,pathname:'/dia-99/',h:1,v:0}, {version:1,pathname:['/dia-01/'],h:1,v:0}]) {
    const dom = new JSDOM('<a data-continuar hidden></a>', {url:'https://curso.example'});
    dom.window.localStorage.setItem('powerbi:ultima:v1', JSON.stringify(saved));
    conectarCurso(dom.window.document, dom.window);
    assert.equal(dom.window.document.querySelector('a').hidden, true);
    dom.window.close();
  }
});

test('continuar utiliza ruta e índices explícitos de la última práctica', () => {
  const dom = new JSDOM('<a data-continuar hidden></a><p data-sin-avance></p>', {url:'https://curso.example'});
  dom.window.localStorage.setItem('powerbi:ultima:v1', JSON.stringify({version:1,pathname:'/practicas/3-2/',h:4,v:1}));
  conectarCurso(dom.window.document, dom.window);
  const a = dom.window.document.querySelector('a');
  assert.equal(a.hidden, false);
  assert.equal(a.getAttribute('href'), '/practicas/3-2/#/4/1');
  dom.window.close();
});

test('JSON dañado y estados desconocidos no impiden marcar una práctica', () => {
  const dom = new JSDOM('<div><select data-actividad-estado="2-1"><option value="pendiente">Pendiente</option><option value="terminada">Terminada</option></select><p role="status"></p></div><p data-resumen-avance></p>', {url:'https://curso.example'});
  dom.window.localStorage.setItem('powerbi:ultima:v1', '{');
  dom.window.localStorage.setItem('powerbi:practica:v1:2-1', '"desconocido"');
  conectarCurso(dom.window.document, dom.window);
  const select = dom.window.document.querySelector('select');
  assert.equal(select.value, 'pendiente');
  select.value = 'terminada'; select.dispatchEvent(new dom.window.Event('change'));
  assert.equal(JSON.parse(dom.window.localStorage.getItem('powerbi:practica:v1:2-1')), 'terminada');
  dom.window.close();
});

test('autoevaluación recupera solo criterios válidos y conserva notas', () => {
  const dom = new JSDOM('<section data-evidencia="A1"><label><input data-criterio="conexion" type="checkbox">Conexión</label><textarea data-notas></textarea><p role="status"></p><p data-conteo></p><button data-exportar></button></section>', {url:'https://curso.example'});
  dom.window.localStorage.setItem('powerbi:entrega:v1:A1', JSON.stringify({criterios:{conexion:'sí'}, notas:'Pendiente'}));
  conectarEntregas(dom.window.document, dom.window);
  assert.equal(dom.window.document.querySelector('input').checked, false);
  assert.equal(dom.window.document.querySelector('textarea').value, 'Pendiente');
  dom.window.close();
});

test('búsqueda ignora acentos y mayúsculas, combina palabras y filtra días', () => {
  const indice = [{titulo:'Relación y CALCULATE',texto:'Modelo de producción',dia:3}, {titulo:'Modelo',texto:'Relación',dia:2}];
  assert.deepEqual(buscar(indice,'relacion PRODUCCION','3'), [indice[0]]);
  assert.deepEqual(buscar(indice,'relacion','2'), [indice[1]]);
  assert.deepEqual(buscar(indice,'   '), []);
  assert.deepEqual(buscar(indice,'inexistente'), []);
});
