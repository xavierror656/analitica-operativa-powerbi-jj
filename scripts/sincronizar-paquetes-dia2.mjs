// Sincroniza las instrucciones del día 2 con los ZIP ya distribuidos.
// Conserva los CSV crudos y las otras actividades byte por byte.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import JSZip from 'jszip';

const carpeta = 'public/descargas/practicas';
const manifiesto = JSON.parse(readFileSync(`${carpeta}/manifest.json`, 'utf8'));
const montaje = readFileSync('src/content/practicas/montaje.md', 'utf8');
const consigna = readFileSync('src/content/practicas/2-1.md', 'utf8');
const conjunto = await JSZip.loadAsync(readFileSync(`${carpeta}/todas-las-actividades.zip`));

for (const id of ['2-1', '2-2', '2-3', '2-4']) {
  const entrada = manifiesto.find(item => item.id === id);
  if (!entrada) throw new Error(`Paquete faltante: ${id}`);
  const zip = await JSZip.loadAsync(readFileSync(`${carpeta}/${entrada.archivo}`));
  zip.file('montaje.md', montaje);
  if (id === '2-1') zip.file('CONSIGNA.md', consigna);
  const bytes = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
  writeFileSync(`${carpeta}/${entrada.archivo}`, bytes);
  entrada.sha256 = createHash('sha256').update(bytes).digest('hex');
  entrada.bytes = bytes.length;
  conjunto.file(entrada.archivo, bytes);
}

writeFileSync(`${carpeta}/manifest.json`, JSON.stringify(manifiesto, null, 2) + '\n');
writeFileSync(`${carpeta}/todas-las-actividades.zip`, await conjunto.generateAsync({
  type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 },
}));
console.log('Paquetes 2.1–2.4, manifiesto y descarga conjunta sincronizados.');
