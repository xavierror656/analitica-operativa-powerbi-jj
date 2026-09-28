/** Prepara el artefacto público sin adelantar materiales de días futuros. */
import { existsSync } from 'node:fs';
import { readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(root, 'dist');
const diaAbierto = Number(process.env.CURSO_DIA_ABIERTO ?? 5);
if (!Number.isInteger(diaAbierto) || diaAbierto < 1 || diaAbierto > 5) {
  throw new Error('CURSO_DIA_ABIERTO debe ser un entero entre 1 y 5');
}
if (!dist.startsWith(root + path.sep) || !existsSync(path.join(dist, 'index.html'))) {
  throw new Error('No existe una compilación válida dentro del proyecto');
}

function destino(relativo) {
  const absoluto = path.resolve(dist, relativo);
  if (!absoluto.startsWith(dist + path.sep)) throw new Error(`Ruta fuera de dist: ${relativo}`);
  return absoluto;
}

const escapar = (texto) => texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function paginaCerrada(titulo) {
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="robots" content="noindex" /><title>${escapar(titulo)} · Power BI</title><style>
    :root{font-family:Inter,Arial,sans-serif;color:#173c37;background:#f4f7f6}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px}main{width:min(100%,720px);padding:clamp(28px,5vw,56px);border-radius:20px;background:#fff;box-shadow:0 18px 50px #123a3420}span{display:inline-block;margin-bottom:18px;color:#08796b;font-size:.85rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}h1{font-size:clamp(2rem,5vw,3rem);line-height:1.15;margin:0 0 16px}p{font-size:1.15rem;line-height:1.6;margin:0 0 28px}a{display:inline-block;padding:14px 20px;border-radius:10px;background:#08796b;color:#fff;font-weight:700;text-decoration:none}a:focus-visible{outline:3px solid #d87900;outline-offset:3px}
  </style></head><body><main data-curso-bloqueado="true"><span>Próximamente en clase</span><h1>${escapar(titulo)}</h1><p>El material de este día se abrirá cuando avance el curso. Hoy puedes trabajar con el día 1.</p><a href="/dia-01/">Abrir el día 1</a></main></body></html>`;
}

await writeFile(destino('apertura-curso.json'), JSON.stringify({ diaAbierto }) + '\n', 'utf8');
if (diaAbierto === 5) {
  console.log('Curso completo disponible en el artefacto.');
  process.exit(0);
}

for (let dia = diaAbierto + 1; dia <= 5; dia++) {
  const titulo = `Día ${dia} aún no disponible`;
  for (const ruta of [`dia-0${dia}/index.html`, `dia-0${dia}/guia/index.html`]) {
    const archivo = destino(ruta);
    if (!existsSync(archivo)) throw new Error(`Falta la página que debe cerrarse: ${ruta}`);
    await writeFile(archivo, paginaCerrada(titulo), 'utf8');
  }
  for (let actividad = 1; actividad <= 4; actividad++) {
    for (const ruta of [`practicas/${dia}-${actividad}/index.html`, `practicas/${dia}-${actividad}/guia/index.html`]) {
      const archivo = destino(ruta);
      if (!existsSync(archivo)) throw new Error(`Falta la práctica que debe cerrarse: ${ruta}`);
      await writeFile(archivo, paginaCerrada(`Práctica ${dia}.${actividad} aún no disponible`), 'utf8');
    }
  }
  const capturas = destino(`imagenes/capturas/dia-0${dia}`);
  if (existsSync(capturas)) await rm(capturas, { recursive: true });
}
if (diaAbierto === 1) await writeFile(destino('practicas/index.html'), paginaCerrada('Prácticas de los próximos días'), 'utf8');

const descargas = destino('descargas');
if (existsSync(descargas)) {
  for (const entrada of await readdir(descargas, { recursive: true })) {
    const ruta = entrada.replaceAll('\\', '/');
    const diaGuia = ruta.match(/^guia-dia-0([1-5])\./)?.[1];
    const diaReferencia = ruta.match(/^referencias\/dia-0([1-5])-/)?.[1];
    const diaPractica = ruta.match(/^practicas\/actividad-([2-5])-/)?.[1];
    const diaEspecial = ruta === 'calendario-dia-03.pq' || ruta === 'medidas-dia-03.dax' ? 3 : ruta === 'verificar_cifras_dia05.py' ? 5 : 0;
    const paqueteCompleto = /^practicas\/(?:todas-las-actividades\.zip|manifest\.json)$/.test(ruta);
    if (Number(diaGuia || diaReferencia || diaPractica || diaEspecial) > diaAbierto || (paqueteCompleto && diaAbierto < 5)) {
      const archivo = destino(path.join('descargas', entrada));
      if (existsSync(archivo)) await rm(archivo);
    }
  }
}
console.log(`Artefacto publicado hasta el día ${diaAbierto}; páginas futuras cerradas y descargas retiradas.`);
