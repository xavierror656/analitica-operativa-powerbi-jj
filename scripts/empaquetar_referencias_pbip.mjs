import { readFile, readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fuentes = path.join(raiz, 'tmp/referencias/proyectos-v2');
const datos = path.join(raiz, 'tmp/referencias/datos');
const salida = path.join(raiz, 'public/descargas/referencias');

async function archivos(dir) {
  const resultado = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const nombre = path.join(dir, entrada.name);
    if (entrada.isDirectory()) resultado.push(...await archivos(nombre));
    else if (entrada.isFile()) resultado.push(nombre);
  }
  return resultado;
}

await mkdir(salida, { recursive: true });
for (const dia of [1, 2]) {
  const nombre = `A${dia}`;
  const proyecto = path.join(fuentes, nombre);
  await stat(path.join(proyecto, `${nombre}.pbip`));
  await stat(path.join(proyecto, 'Referencia.SemanticModel/.pbi/cache.abf'));
  const zip = new JSZip();

  for (const archivo of await archivos(proyecto)) {
    const relativo = path.relative(proyecto, archivo).replaceAll('\\', '/');
    if (['localSettings.json', 'editorSettings.json'].includes(path.basename(archivo))) continue;
    let contenido = await readFile(archivo);
    if (relativo === 'Referencia.SemanticModel/definition/expressions.tmdl') {
      const texto = contenido.toString('utf8').replace(
        /expression RutaDatos = "[^"]+"/,
        'expression RutaDatos = "C:\\CAMBIA_ESTA_RUTA\\datos"',
      );
      if (texto === contenido.toString('utf8')) throw new Error(`No se encontró RutaDatos en ${nombre}`);
      contenido = Buffer.from(texto, 'utf8');
    }
    zip.file(`${nombre}/${relativo}`, contenido);
  }

  for (const archivo of await archivos(datos)) {
    if (path.extname(archivo).toLowerCase() === '.csv') zip.file(`datos/${path.basename(archivo)}`, await readFile(archivo));
  }
  zip.file('LEEME.txt', `Referencia ${nombre} · proyecto Power BI (.pbip)\n\n` +
    `1. Extrae TODO el ZIP en una carpeta; conserva juntas las carpetas ${nombre} y datos.\n` +
    `2. Abre ${nombre}/${nombre}.pbip en Power BI Desktop.\n` +
    '3. En Transformar datos > Administrar parámetros, cambia RutaDatos por la ruta completa de la carpeta datos extraída, sin barra final.\n' +
    `4. Aplica los cambios y pulsa Actualizar. Compara los resultados con la guía del día ${dia}.\n\n` +
    'Los CSV son sintéticos. El proyecto incluye una caché de datos para abrir la referencia; actualizar requiere ajustar RutaDatos.\n');
  const destino = path.join(salida, `dia-${String(dia).padStart(2, '0')}-referencia-pbip.zip`);
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  await writeFile(destino, buffer);
  console.log(`${path.relative(raiz, destino)}: ${buffer.length} bytes`);
}
