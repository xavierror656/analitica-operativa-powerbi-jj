import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';

class Elemento extends EventTarget {
  dataset = {}; textContent = ''; disabled = false; attrs = {}; children = {}; classes = new Set();
  classList = {
    add: (...names) => names.forEach(n => this.classes.add(n)),
    remove: (...names) => names.forEach(n => this.classes.delete(n)),
    toggle: (name, force) => force ? this.classes.add(name) : this.classes.delete(name),
  };
  setAttribute(name, value) { this.attrs[name] = value; }
  querySelector(selector) { return this.children[selector] ?? null; }
  querySelectorAll(selector) { return this.children[selector] ?? []; }
  closest() { return this.section; }
  click() { if (!this.disabled) this.dispatchEvent(new Event('click')); }
}
function ejecutar(componente, entorno) {
  const source = readFileSync(new URL(`../src/components/ui/${componente}.astro`, import.meta.url), 'utf8');
  runInNewContext(stripTypeScriptTypes(source.match(/<script>([\s\S]*?)<\/script>/)[1]), entorno);
}
function cambiar(document, slide) {
  const event = new Event('slidechanged');
  event.currentSlide = slide; // Reveal no utiliza CustomEvent.detail.
  document.dispatchEvent(event);
}
test('quiz: volver ocho veces no acumula manejadores ni conserva la respuesta anterior', () => {
  const quiz = new Elemento(); quiz.section = {};
  const opciones = [new Elemento(), new Elemento()];
  opciones.forEach((opcion, i) => {
    opcion.dataset.correcta = String(i === 0);
    const correcto = new Elemento(), incorrecto = new Elemento();
    opcion.children = { '.quiz-icono-correcta': correcto, '.quiz-icono-incorrecta': incorrecto, '.quiz-opcion-icono': [correcto, incorrecto] };
  });
  const explicacion = new Elemento(), resultado = new Elemento(), document = new Elemento();
  quiz.children = { '.quiz-opcion': opciones, '.quiz-explicacion': explicacion, '.quiz-resultado': resultado };
  document.children['.quiz'] = [quiz];
  let respuestas = 0;
  Object.defineProperty(resultado, 'textContent', { get: () => '', set(value) { if (value) respuestas++; } });
  ejecutar('Quiz', { document });
  for (let vuelta = 0; vuelta < 8; vuelta++) {
    opciones[1].click();
    assert.equal(quiz.dataset.respondido, 'true');
    assert.ok(opciones[0].classes.has('quiz-correcta'));
    assert.ok(opciones[1].classes.has('quiz-incorrecta'));
    cambiar(document, quiz.section);
    assert.equal(quiz.dataset.respondido, 'true');
    cambiar(document, {});
    assert.equal(quiz.dataset.respondido, undefined);
    assert.equal(opciones[0].disabled, false);
    assert.ok(explicacion.classes.has('hidden'));
  }
  assert.equal(respuestas, 8);
});
test('cronómetro: tiempo real, pausa, continuación y reinicio al salir', () => {
  const timer = new Elemento(), numero = new Elemento(), hint = new Elemento(), document = new Elemento();
  timer.section = {}; timer.dataset.minutos = '2';
  timer.children = { '.cronometro-numero': numero, '.cronometro-hint': hint };
  document.children['.cronometro'] = [timer];
  let ahora = 0, tick;
  ejecutar('Cronometro', { document, Date: { now: () => ahora },
    window: { setInterval(callback) { tick = callback; return 1; }, clearInterval() { tick = undefined; } },
  });
  timer.click(); ahora = 65000; tick(); // Simula pestaña en segundo plano.
  assert.equal(numero.textContent, '0:55');
  timer.click(); assert.equal(numero.attrs['aria-pressed'], 'false');
  ahora = 90000; timer.click(); cambiar(document, timer.section);
  assert.equal(numero.textContent, '0:55');
  ahora = 145000; tick();
  assert.equal(numero.textContent, '0:00');
  assert.equal(numero.attrs['aria-pressed'], 'false');
  cambiar(document, {});
  assert.equal(numero.textContent, '2:00'); assert.equal(tick, undefined);
});
