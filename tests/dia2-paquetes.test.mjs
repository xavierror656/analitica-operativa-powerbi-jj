import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import JSZip from 'jszip';

test('los cuatro ZIP del día 2 contienen las instrucciones vigentes y el paquete conjunto coincide', async () => {
  const base = 'public/descargas/practicas';
  const manifiesto = JSON.parse(readFileSync(`${base}/manifest.json`, 'utf8'));
  const montaje = readFileSync('src/content/practicas/montaje.md', 'utf8');
  const consigna = readFileSync('src/content/practicas/2-1.md', 'utf8');
  const conjunto = await JSZip.loadAsync(readFileSync(`${base}/todas-las-actividades.zip`));
  for (const id of ['2-1', '2-2', '2-3', '2-4']) {
    const entrada = manifiesto.find(item => item.id === id);
    assert.ok(entrada);
    const bytes = readFileSync(`${base}/${entrada.archivo}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), entrada.sha256);
    assert.deepEqual(await conjunto.file(entrada.archivo).async('nodebuffer'), bytes);
    const zip = await JSZip.loadAsync(bytes);
    assert.equal(await zip.file('montaje.md').async('string'), montaje);
    if (id === '2-1') assert.equal(await zip.file('CONSIGNA.md').async('string'), consigna);
  }
});
