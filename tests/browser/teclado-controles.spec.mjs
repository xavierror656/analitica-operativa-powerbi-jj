import { test, expect } from '@playwright/test';

for (const tecla of ['Space', 'Enter']) {
  test(`responder quiz con ${tecla} conserva la diapositiva`, async ({page}) => {
    await page.goto('/dia-01/');
    await expect(page.locator('.slides > section.present')).toBeVisible();
    const indice = await page.locator('.slides > section').evaluateAll(slides => slides.findIndex(s => s.querySelector('.quiz')));
    await page.goto(`/dia-01/#/${indice}`);
    const quiz = page.locator('.slides > section.present .quiz');
    await expect(quiz).toBeVisible();
    await quiz.locator('.quiz-opcion').first().focus();
    await page.keyboard.press(tecla);
    await expect(quiz).toHaveAttribute('data-respondido', 'true');
    await expect(page).toHaveURL(new RegExp(`#/${indice}$`));
    await expect(quiz.locator('[role=status]')).not.toBeEmpty();
  });
}

test('espacio inicia y pausa cronómetro sin avanzar diapositiva', async ({page}) => {
  await page.goto('/dia-03/');
  await expect(page.locator('.slides > section.present')).toBeVisible();
  const indice = await page.locator('.slides > section').evaluateAll(slides => slides.findIndex(s => s.querySelector('.cronometro')));
  await page.goto(`/dia-03/#/${indice}`);
  const boton = page.locator('.slides > section.present .cronometro-numero');
  await expect(boton).toBeVisible();
  await boton.focus();
  await page.keyboard.press('Space');
  await expect(boton).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(new RegExp(`#/${indice}$`));
  await page.keyboard.press('Space');
  await expect(boton).toHaveAttribute('aria-pressed', 'false');
  await expect(page).toHaveURL(new RegExp(`#/${indice}$`));
});
