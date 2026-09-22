/** Exporta SVG estáticos desde los mismos JSON que usa el reproductor. */
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
const fichas=JSON.parse(fs.readFileSync('src/data/animaciones.json','utf8'));
const dom=new JSDOM('<!doctype html><html><body><div id="anim"></div></body></html>',{runScripts:'outside-only',pretendToBeVisual:true});
// Los recursos son vectoriales y no contienen texto ni imágenes rasterizadas.
dom.window.HTMLCanvasElement.prototype.getContext=()=>({fillRect(){},clearRect(){},getImageData(){return {data:new Uint8ClampedArray(4)};}});
dom.window.eval(fs.readFileSync('node_modules/lottie-web/build/player/lottie_light.js','utf8'));
for(const [nombre,ficha] of Object.entries(fichas)){
 const data=JSON.parse(fs.readFileSync('public/animaciones/'+nombre+'.json','utf8'));
 if(data.assets?.some(a=>a.p)||data.fonts)throw new Error('El póster requiere recursos externos: '+nombre);
 const item=dom.window.lottie.loadAnimation({container:dom.window.document.getElementById('anim'),renderer:'svg',animationData:data,autoplay:false,loop:false});
 await new Promise((resolve,reject)=>{if(item.isLoaded)resolve();else{item.addEventListener('DOMLoaded',resolve);item.addEventListener('data_failed',reject);}});
 item.goToAndStop(ficha.posterFrame,true);
 const svg=item.renderer.svgElement;
 svg.removeAttribute('xmlns');svg.removeAttribute('xmlns:xlink');
 const output=new dom.window.XMLSerializer().serializeToString(svg);
 fs.writeFileSync('public/animaciones/'+nombre+'.svg',output+'\n');
 item.destroy();
}
dom.window.close();
console.log('6 pósteres SVG exportados desde sus animaciones Lottie.');

