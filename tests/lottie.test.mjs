import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {DotLottie} from '@lottiefiles/dotlottie-web';
import {conectarAnimaciones} from '../src/lib/lottie-slides.mjs';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function entorno(search='',motion=false,fail=false){
 const figura='<figure data-lottie data-src="/animaciones/flujo.json"><img><canvas></canvas><button hidden>Reproducir animación</button></figure>';
 const dom=new JSDOM('<div class="reveal"><div class="slides"><section class="present">'+figura+'</section><section>'+figura+'</section></div></div>',{url:'https://curso.test/dia-01/'+search,pretendToBeVisual:true});
 const win=dom.window, doc=win.document, media=new win.EventTarget();
 media.matches=motion;win.matchMedia=()=>media;
 const players=[];let imports=0;
 class Player{
  constructor(config){this.config=config;this.events={};this.isPlaying=false;this.currentFrame=0;this.totalFrames=120;players.push(this);queueMicrotask(()=>this.events[fail?'loadError':'load']?.());}
  addEventListener(name,fn){this.events[name]=fn;}
  play(){this.isPlaying=true;}
  pause(){this.isPlaying=false;}
  freeze(){this.frozen=true;}
  unfreeze(){this.frozen=false;}
  setFrame(frame){this.currentFrame=frame;}
  destroy(){this.destroyed=true;this.pause();}
 }
 const dispose=conectarAnimaciones({document:doc,window:win,cargar:async()=>{imports++;return Player;}});
 return {win,doc,media,players,get imports(){return imports;},close(){dispose();win.close();}};
}
test('Lottie: solo carga la slide activa, reproduce una vez y permite pausar/repetir',async()=>{
 const e=entorno();await tick();
 assert.equal(e.imports,1);assert.equal(e.players.length,1);
 const p=e.players[0],sections=e.doc.querySelectorAll('section'),button=sections[0].querySelector('button');
 assert.equal(p.isPlaying,true);assert.equal(p.config.loop,false);
 let avances=0;e.doc.addEventListener('keydown',()=>avances++);
 button.dispatchEvent(new e.win.KeyboardEvent('keydown',{key:' ',bubbles:true}));
 button.dispatchEvent(new e.win.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert.equal(avances,0,'Pausar con teclado no debe avanzar la presentación');
 button.click();assert.equal(p.isPlaying,false);
 button.click();assert.equal(p.isPlaying,true);
 p.currentFrame=119;p.events.complete();assert.equal(p.isPlaying,false);
 button.click();assert.equal(p.currentFrame,0);assert.equal(p.isPlaying,true);
 sections[0].classList.remove('present');sections[1].classList.add('present');await tick();
 assert.equal(p.isPlaying,false);assert.equal(p.frozen,true);
 assert.equal(e.players.length,2);assert.equal(e.imports,1);
 assert.equal(e.players[1].isPlaying,true);
 e.doc.querySelector('.reveal').classList.add('overview');await tick();
 assert.equal(e.players[1].isPlaying,false);
 e.close();assert.ok(e.players.every(p=>p.destroyed));
});
test('Lottie: PDF y movimiento reducido evitan descargar el motor',async()=>{
 for(const [query,motion] of [['?print-pdf',false],['?view=print',false],['',true]]){
  const e=entorno(query,motion);await tick();
  assert.equal(e.imports,0);assert.equal(e.players.length,0);
  assert.equal(e.doc.querySelector('[data-playing]'),null);e.close();
 }
});
test('Lottie: impresión, cambio de preferencia y errores conservan el póster',async()=>{
 const e=entorno();await tick();const p=e.players[0];
 e.win.dispatchEvent(new e.win.Event('beforeprint'));
 assert.equal(p.isPlaying,false);assert.equal(e.doc.querySelector('[data-playing]'),null);
 e.win.dispatchEvent(new e.win.Event('afterprint'));
 e.media.matches=true;e.media.dispatchEvent(new e.win.Event('change'));
 assert.ok(e.doc.querySelector('button').hidden);
 assert.equal(e.doc.querySelector('[data-playing]'),null);e.close();
 const fallo=entorno('',false,true);await tick();
 assert.ok(fallo.players[0].destroyed);assert.equal(fallo.doc.querySelector('[data-playing]'),null);
 assert.ok(fallo.doc.querySelector('button').hidden);fallo.close();
});
test('Lottie: los seis JSON se renderizan con el motor oficial y contienen movimiento',async()=>{
 const wasm=fs.readFileSync(new URL('../node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm',import.meta.url));
 DotLottie.setWasmUrl('data:application/wasm;base64,'+wasm.toString('base64'));
 const catalog=JSON.parse(fs.readFileSync(new URL('../src/data/animaciones.json',import.meta.url),'utf8'));
 for(const [name,info] of Object.entries(catalog)){
  const data=fs.readFileSync(new URL('../public/animaciones/'+name+'.json',import.meta.url),'utf8');
  const player=new DotLottie({canvas:{width:640,height:480},data,autoplay:false,loop:false,renderConfig:{autoResize:false,freezeOnOffscreen:false,devicePixelRatio:1}});
  try{
   await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error(name+': timeout')),10000);
    player.addEventListener('load',()=>{clearTimeout(timeout);resolve();});
    player.addEventListener('loadError',e=>{clearTimeout(timeout);reject(e);});
   });
   player.setFrame(0);const first=Buffer.from(player.buffer);
   player.setFrame(info.posterFrame);const last=Buffer.from(player.buffer);
   assert.equal(last.length,640*480*4);
   assert.ok(last.some(value=>value!==0),name+': salida vacía');
   assert.notDeepEqual(first,last,name+': sin movimiento');
   const svg=fs.readFileSync(new URL('../public/animaciones/'+name+'.svg',import.meta.url),'utf8');
   assert.match(svg,/<svg/);assert.match(svg,/<path/);
  }finally{player.destroy();}
 }
});
