import { test, expect } from '@playwright/test';

test('día 2 conserva la navegación y muestra el contenido completo en laptop', async ({ page }) => {
  await page.goto('/dia-02/');
  const slides = page.locator('.slides > section');
  const total = await slides.count();
  expect(total).toBe(39);
  for (let i = 0; i < total; i++) {
    await page.evaluate(index => { window.location.hash = `/${index}`; }, i);
    const slide = slides.nth(i);
    await expect(slide).toHaveClass(/present/);
    const geometry = await slide.evaluate(el => ({
      horizontal: el.scrollWidth - el.clientWidth,
      vertical: el.scrollHeight - el.clientHeight,
    }));
    expect.soft(geometry.horizontal, `slide ${i}: desborde horizontal`).toBeLessThanOrEqual(2);
    expect.soft(geometry.vertical, `slide ${i}: desborde vertical`).toBeLessThanOrEqual(2);
  }
  await page.goto('/dia-02/guia/');
  await expect(page.getByRole('heading', { name: /Construye el modelo/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Descargar guía/i })).toHaveAttribute('href', '/descargas/guia-dia-02.md');
});

test('práctica 2.1 permite abrir guía y descargar su paquete', async ({ page }) => {
  await page.goto('/practicas/2-1/');
  await expect(page.getByRole('link', { name: /Datos de la actividad/i })).toHaveAttribute('href', '/descargas/practicas/actividad-2-1.zip');
  const nuevaPromesa = page.context().waitForEvent('page');
  await page.getByRole('navigation', { name: 'Recursos de la presentación' }).getByRole('link', { name: /Guía/i }).click();
  const nueva = await nuevaPromesa;
  await expect(nueva.getByRole('heading', { name: /Armar el modelo/i }).first()).toBeVisible();
});
