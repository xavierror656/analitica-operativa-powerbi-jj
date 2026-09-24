import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

test('reanudar una presentación desde la portada', async ({page}) => {
  await page.goto('/dia-02/#/3');
  await expect(page.locator('#deck-position')).toContainText('4 /');
  await page.goto('/');
  const continuar = page.locator('[data-continuar]');
  await expect(continuar).toContainText('día 2 · diapositiva 4');
  await continuar.click();
  await expect(page.locator('#deck-position')).toContainText('4 /');
});

test('prácticas conservan estado entre catálogo y guía', async ({page}) => {
  await page.goto('/practicas/');
  await page.locator('#estado-2-1').selectOption('en-proceso');
  await page.goto('/practicas/2-1/guia/');
  await expect(page.locator('#estado-2-1')).toHaveValue('en-proceso');
  await page.locator('#estado-2-1').selectOption('terminada');
  await page.goto('/practicas/');
  await expect(page.locator('#estado-2-1')).toHaveValue('terminada');
  await expect(page.locator('[data-resumen-avance]')).toHaveText('1 de 16 prácticas terminadas');
});

test('buscador devuelve conceptos y respeta el día', async ({page}) => {
  await page.goto('/buscar/');
  await page.getByLabel('Concepto o fórmula').fill('CALCULATE');
  await page.getByLabel('Día', {exact:true}).selectOption('3');
  await page.getByRole('button', {name:'Buscar',exact:true}).click();
  await expect(page.locator('#resultados a').first()).toBeVisible();
  for (const href of await page.locator('#resultados a').evaluateAll(a=>a.map(x=>x.getAttribute('href')))) expect(href).toMatch(/dia-03|practicas\/3-/);
  await page.locator('#resultados a').first().click();
  await expect(page.locator('main')).toContainText(/CALCULATE/i);
  await page.goto('/buscar/?q=zzzzsinresultado');
  await expect(page.locator('#resultado-estado')).toContainText('No hay coincidencias');
});

test('autoevaluación guarda y descarga requisitos y notas', async ({page}) => {
  await page.goto('/entregas/');
  await page.locator('#A1 input').first().check();
  await page.locator('#notas-A1').fill('Actualización comprobada; falta revisión cruzada.');
  await page.reload();
  await expect(page.locator('#A1 input').first()).toBeChecked();
  await expect(page.locator('#notas-A1')).toHaveValue('Actualización comprobada; falta revisión cruzada.');
  const download = page.waitForEvent('download');
  await page.locator('#A1 [data-exportar]').click();
  const archivo = await download;
  expect(archivo.suggestedFilename()).toBe('autoevaluacion-A1.md');
  const contenido = readFileSync(await archivo.path(), 'utf8');
  expect(contenido).toContain('- [x] Ocho consultas');
  expect(contenido).toContain('falta revisión cruzada');
  expect(contenido).toContain('- [ ]');
});

test('almacenamiento bloqueado permite trabajar y avisa', async ({page}) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', {get(){throw new Error('blocked');}}));
  await page.goto('/practicas/');
  await page.locator('#estado-2-1').selectOption('terminada');
  await expect(page.locator('.practice-progress').first()).toContainText('No se pudo guardar');
  await page.goto('/entregas/');
  await page.locator('#A1 input').first().check();
  await expect(page.locator('#A1 [role=status]')).toContainText('No se pudo guardar');
});

for (const ruta of ['/', '/buscar/', '/entregas/', '/referencias/', '/practicas/', '/practicas/2-1/guia/', '/dia-03/guia/']) {
  test(`accesibilidad, teclado y geometría ${ruta}`, async ({page}, info) => {
    await page.goto(ruta);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', {name:'Ir al contenido'})).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const resultado = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(resultado.violations).toEqual([]);
    await page.screenshot({path:info.outputPath('pagina.png'), fullPage:true});
  });
}

test('proyección mantiene la diapositiva dentro del lienzo', async ({page}, info) => {
  await page.goto('/dia-03/#/2');
  await expect(page.locator('#deck-position')).toContainText('3 /');
  const slide = page.locator('.slides > section.present');
  await expect(slide).toBeVisible();
  expect(await slide.evaluate(el => el.scrollHeight <= el.clientHeight + 2 && el.scrollWidth <= el.clientWidth + 2)).toBe(true);
  await page.screenshot({path:info.outputPath('presentacion.png')});
});

test('tablas de la guía permiten desplazarse con teclado en móvil', async ({page}, info) => {
  test.skip(info.project.name !== 'movil', 'Solo hay desbordamiento de tablas en móvil');
  await page.goto('/dia-03/guia/');
  const tabla = page.locator('.reading table[tabindex="0"]').first();
  await expect(tabla).toBeVisible();
  await tabla.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => tabla.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
});
