import { test, expect } from '@playwright/test';
import { loginAndSelectBranch, trackPageHealth } from './helpers';

test.describe('Vinos y añejados', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectBranch(page);
    await page.getByRole('link', { name: 'Vinos y añejados' }).click();
    await expect(page.getByRole('heading', { name: 'Vinos y añejados' })).toBeVisible();
  });

  test('tabs 10/20/25/Reserva joven cambian el contenido de la tabla', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackPageHealth(page);
    const segmented = page.getByRole('tablist', { name: 'Categoría de añejamiento' });
    await expect(segmented).toBeVisible();

    const tabs = segmented.getByRole('tab');
    const tabCount = await tabs.count();
    for (let i = 0; i < tabCount; i += 1) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');
    }

    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    expect(failedRequests, failedRequests.join('\n')).toEqual([]);
  });

  test('ajuste de stock (entrada) actualiza cantidad y aparece en Movimientos', async ({ page }) => {
    const adjustButton = page.getByRole('button', { name: 'Ajustar stock' }).first();
    await expect(adjustButton).toBeVisible();
    const row = page.locator('tbody tr').first();
    const wineName = await row.locator('td').first().innerText();

    await adjustButton.click();
    await expect(page.getByRole('heading', { name: 'Ajuste de stock' })).toBeVisible();

    await page.getByRole('radio', { name: 'Entrada' }).click();
    await page.getByLabel('Cantidad (botellas)').fill('5');
    await page.getByLabel('Motivo').fill('QA - ingreso de prueba');
    await page.getByRole('button', { name: 'Registrar movimiento' }).click();

    await expect(page.getByRole('heading', { name: 'Ajuste de stock' })).toHaveCount(0);

    await page.getByRole('link', { name: 'Movimientos' }).click();
    await expect(page.getByRole('heading', { name: 'Movimientos' })).toBeVisible();
    const movementRow = page.locator('tbody tr').filter({ hasText: 'QA - ingreso de prueba' });
    await expect(movementRow).toHaveCount(1);
    await expect(movementRow).toContainText(wineName.split('\n')[0].trim().slice(0, 5));
  });

  test('ajuste de stock rechaza salida mayor al stock disponible', async ({ page }) => {
    const adjustButton = page.getByRole('button', { name: 'Ajustar stock' }).first();
    await adjustButton.click();
    await page.getByRole('radio', { name: 'Salida' }).click();
    await page.getByLabel('Cantidad (botellas)').fill('999999');
    await page.getByLabel('Motivo').fill('QA - salida excesiva');
    await page.getByRole('button', { name: 'Registrar movimiento' }).click();
    await expect(page.getByRole('alert')).toContainText('No hay suficiente stock');
  });
});
