/** Diagramas originales del curso en formato Lottie. Sin imágenes ni fuentes externas. */
import fs from 'node:fs';
const dir='public/animaciones';
fs.mkdirSync(dir,{recursive:true});
const C={ink:[.055,.231,.212,1],teal:[.078,.722,.651,1],mint:[.31,.82,.773,1],paper:[.906,.937,.929,1],gold:[.961,.651,.137,1],white:[1,1,1,1]};
const p=k=>({a:0,k});
const key=(t,s)=>({t,s,i:{x:[.667],y:[1]},o:{x:[.333],y:[0]}});
const animated=(a,b,start=0,end=45)=>({a:1,k:[key(start,a),key(end,b)]});
const transform={ty:'tr',p:p([0,0]),a:p([0,0]),s:p([100,100]),r:p(0),o:p(100),sk:p(0),sa:p(0)};
const fill=c=>({ty:'fl',c:p(c),o:p(100),r:1});
const stroke=(c,w=7)=>({ty:'st',c:p(c),o:p(100),w:p(w),lc:2,lj:2});
const rect=(x,y,w,h,c,r=14)=>({ty:'gr',it:[{ty:'rc',p:p([x,y]),s:p([w,h]),r:p(r)},fill(c),transform]});
const ellipse=(x,y,w,h,c)=>({ty:'gr',it:[{ty:'el',p:p([x,y]),s:p([w,h])},fill(c),transform]});
const line=(points,c,w=7,trim=false)=>({ty:'gr',it:[{ty:'sh',ks:p({v:points,i:points.map(()=>[0,0]),o:points.map(()=>[0,0]),c:false})},stroke(c,w),...(trim?[{ty:'tm',s:p(0),e:animated([0],[100],15,70),o:p(0),m:1}]:[]),transform]});
function layer(name,shapes,ks={}){return {ddd:0,ind:0,ty:4,nm:name,sr:1,ks:{o:p(100),r:p(0),p:p([0,0,0]),a:p([0,0,0]),s:p([100,100,100]),...ks},ao:0,shapes:shapes.toReversed(),ip:0,op:120,st:0,bm:0};}
function save(name,layers){const data={v:'5.7.4',fr:30,ip:0,op:120,w:640,h:480,nm:name,ddd:0,assets:[],layers:layers.map((l,i)=>({...l,ind:i+1})),markers:[]};fs.writeFileSync(dir+'/'+name+'.json',JSON.stringify(data));}
const table=(x,y,c)=>[rect(x,y,134,142,C.paper),rect(x,y-48,110,24,c,5),...[-12,20,52].map(d=>rect(x,y+d,100,9,C.ink,3))];
save('flujo',[
 layer('Dato en movimiento',[ellipse(0,0,20,20,C.gold)],{p:{a:1,k:[key(0,[98,240,0]),key(40,[320,240,0]),key(85,[542,240,0]),key(119,[542,240,0])]}}),
 layer('Tablas',[...table(105,240,C.ink),...table(320,240,C.teal),...table(535,240,C.teal)]),
 layer('Conexiones',[line([[140,240],[500,240]],C.mint,8)])
]);
const bars=[{x:170,h:100,c:C.mint},{x:270,h:200,c:C.teal},{x:370,h:140,c:C.gold},{x:470,h:255,c:C.teal}];
save('indicadores',[
 ...bars.map((b,i)=>layer('Indicador '+(i+1),[rect(0,-b.h/2,58,b.h,b.c,7)],{p:p([b.x,362,0]),s:animated([100,3,100],[100,100,100],i*10,65+i*10)})),
 layer('Ejes',[line([[105,95],[105,365],[535,365]],C.ink,9),... [180,250,320].map(y=>line([[125,y],[535,y]],C.paper,3))])
]);
save('reporte',[
 layer('Recorrido de lectura',[ellipse(0,0,17,17,C.gold)],{p:{a:1,k:[key(0,[150,150,0]),key(30,[445,150,0]),key(65,[445,320,0]),key(100,[175,320,0]),key(119,[175,320,0])]}}),
 layer('Dashboard',[rect(320,240,510,342,C.ink,22),rect(320,257,468,268,C.white,8),rect(175,160,130,45,C.mint,8),rect(320,160,130,45,C.paper,8),rect(465,160,130,45,C.paper,8),... [70,100,145].map((h,i)=>rect(145+i*55,354-h/2,30,h,C.teal,4)),line([[340,330],[390,288],[432,309],[490,232]],C.teal,8),rect(173,105,170,9,C.mint,3)])
]);
save('actualizacion',[
 layer('Ejecución',[ellipse(0,0,19,19,C.gold)],{p:{a:1,k:[key(0,[130,170,0]),key(12,[130,125,0]),key(40,[480,125,0]),key(60,[480,365,0]),key(95,[130,365,0]),key(119,[130,170,0])]}}),
 layer('Origen y resultado',[...table(130,240,C.ink),...table(480,240,C.teal)]),
 layer('Ruta',[line([[130,170],[130,125],[480,125],[480,365],[130,365],[130,170]],C.teal,8),line([[305,108],[325,125],[305,142]],C.teal,8),line([[335,348],[315,365],[335,382]],C.teal,8)])
]);
save('validacion',[
 layer('Comprobación',[line([[208,242],[287,317],[434,159]],C.white,28,true)]),
 layer('Evidencia',[ellipse(320,240,340,340,C.teal)])
]);
console.log('5 diagramas originales regenerados. El recurso capas.json conserva su archivo original y licencia.');
