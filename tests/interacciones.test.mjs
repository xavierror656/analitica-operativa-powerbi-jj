import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { conectarAvance } from '../src/lib/avance-presentacion.mjs';

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

test('presentación: conserva teclado de recursos y se recupera si pantalla completa falla', async () => {
  const source = readFileSync(new URL('../src/components/RevealDeck.astro', import.meta.url), 'utf8');
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*?;\s*$/gm, '');
  const document = new Elemento(), posicion = new Elemento(), proyectar = new Elemento();
  document.children = { '#deck-position': posicion, '#proyectar': proyectar };
  document.fullscreenEnabled = true;
  let solicitudes = 0, layouts = 0, options;
  document.documentElement = { async requestFullscreen() { solicitudes++; throw new Error('denegado'); } };
  const handlers = {};
  let slide = 0;
  class Reveal {
    constructor(config) { options = config; }
    initialize() {}
    on(name, fn) { (handlers[name] ??= []).push(fn); }
    getIndices() { return {h:slide}; }
    getTotalSlides() { return 8; }
    layout() { layouts++; }
  }
  const window = { location: {pathname:'/dia-01/', search:'', hash:''}, localStorage: {getItem:()=>null,setItem:()=>{}} };
  runInNewContext(stripTypeScriptTypes(script), { document, window, Reveal, Notes: {}, Element: Elemento, URLSearchParams, conectarAvance });
  handlers.ready.forEach(fn=>fn()); assert.equal(posicion.textContent, '1 / 8');
  slide = 7; handlers.slidechanged.forEach(fn=>fn()); assert.equal(posicion.textContent, '8 / 8');
  const recurso = new Elemento(); recurso.section = {};
  assert.equal(options.keyboardCondition({target:recurso}), false);
  assert.equal(options.keyboardCondition({target:new Elemento()}), true);
  proyectar.click(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(solicitudes, 1);
  assert.equal(proyectar.textContent, 'Usa F11 para proyectar');
  document.fullscreenEnabled = false;
  proyectar.click(); assert.equal(solicitudes, 1);
  document.dispatchEvent(new Event('fullscreenchange'));
  assert.equal(layouts, 1);
});

function progreso({pathname='/dia-02/',hash='',pdf=false,store=new Map(),blocked=false}={}) {
  const handlers = {};
  let h=0, v=0;
  const mensajes=[];
  const emit = name => (handlers[name] || []).forEach(fn=>fn());
  const deck = {
    on(name,fn) { (handlers[name]??=[]).push(fn); },
    getIndices() { return {h,v}; },
    getSlide(x,y) { return x < 8 && y === 0 ? {} : undefined; },
    slide(x,y) { h=x;v=y;emit('slidechanged'); },
  };
  conectarAvance(deck, {pathname,hash,pdf,storage:()=>{
    if(blocked)throw new Error('Storage deshabilitado');
    return {getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};
  },informar:msg=>mensajes.push(msg)});
  emit('ready');
  return {deck,store,mensajes};
}

test('avance: recupera cada presentación y normaliza la barra final de la ruta',()=>{
  const store=new Map();
  progreso({store}).deck.slide(5,0);
  progreso({store,pathname:'/practicas/2-1/'}).deck.slide(3,0);
  const vuelta=progreso({store,pathname:'/dia-02'});
  assert.equal(vuelta.deck.getIndices().h,5);
  assert.match(vuelta.mensajes.at(-1),/Retomaste la diapositiva 6/);
  assert.equal(progreso({store,pathname:'/practicas/2-1/'}).deck.getIndices().h,3);
  vuelta.deck.slide(0,0);
  assert.equal(progreso({store}).deck.getIndices().h,0);
});

test('avance: respeta enlaces explícitos, descarta datos corruptos y tolera bloqueo',()=>{
  const key='powerbi:avance:v1:/dia-02';
  for(const valor of ['{mal', 'null', '{"version":1,"h":99,"v":0}', '{"version":1,"h":-1,"v":0}', '{"version":1,"h":"3","v":0}']) {
    assert.equal(progreso({store:new Map([[key,valor]])}).deck.getIndices().h,0);
  }
  const store=new Map([[key,JSON.stringify({version:1,h:5,v:0})]]);
  assert.equal(progreso({store,hash:'#/0'}).deck.getIndices().h,0);
  const bloqueado=progreso({blocked:true});
  bloqueado.deck.slide(4,0);
  assert.match(bloqueado.mensajes.at(-1),/no permite guardar/);
});

test('PDF: no lee ni sobrescribe el avance mientras prepara todas las diapositivas',()=>{
  const store=new Map([['powerbi:avance:v1:/dia-02','{"version":1,"h":6,"v":0}']]);
  const antes=[...store];
  const pdf=progreso({store,pdf:true,blocked:true});
  pdf.deck.slide(0,0);
  assert.deepEqual([...store],antes);
  assert.equal(pdf.mensajes.length,0);
});

test('PDF: espera fuentes y pdf-ready; imprime sin notas ni duplicados por fragmento',async()=>{
  const source=readFileSync(new URL('../src/components/RevealDeck.astro',import.meta.url),'utf8');
  const script=source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*?;\s*$/gm,'');
  const document=new Elemento(), button=new Elemento(), estado=new Elemento();
  button.disabled=true;
  document.children={'#guardar-pdf':button,'#pdf-status':estado};
  document.documentElement=new Elemento();
  let fontsReady;
  document.fonts={ready:new Promise(resolve=>fontsReady=resolve)};
  let initialized=0,printed=0,config;
  const handlers={};
  class Reveal {
    constructor(options){config=options;}
    on(name,fn){handlers[name]=fn;}
    initialize(){initialized++;}
    getTotalSlides(){return 39;}
  }
  const window={location:{pathname:'/dia-02/',search:'?print-pdf',hash:''},print:()=>printed++};
  Object.defineProperty(window,'localStorage',{get(){throw new Error('PDF no debe tocar almacenamiento');}});
  runInNewContext(stripTypeScriptTypes(script),{document,window,Reveal,Notes:{},Element:Elemento,URLSearchParams,conectarAvance});
  assert.equal(initialized,0);
  assert.ok(document.documentElement.classes.has('pdf-export'));
  fontsReady();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(initialized,1);
  assert.equal(config.view,'print');
  assert.equal(config.pdfSeparateFragments,false);
  assert.equal(config.showNotes,false);
  button.click();assert.equal(printed,0);
  handlers['pdf-ready']();
  assert.equal(button.disabled,false);
  assert.match(estado.textContent,/39 diapositivas listas/);
  button.click();assert.equal(printed,1);
});
