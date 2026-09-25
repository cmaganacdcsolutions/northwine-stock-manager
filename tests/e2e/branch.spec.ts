import { test, expect } from '@playwright/test';
import { login, trackPageHealth } from './helpers';

test.describe('Selección y cambio de sucursal', () => {
  test('selección de sucursal navega a Dashboard y muestra su nombre en el header', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackPageHealth(page);
    await login(page);
    await expect(page).toHaveURL(/\/sucursales/);
    await expect(page.getByRole('heading', { name: 'Elegí una sucursal' })).toBeVisible();

    await page.getByText('Bodega Principal', { exact: false }).first().click();
    await page.waitForURL(/\/dashboard/);
    // Scope to the header's branch switcher to avoid matching the dashboard subtitle too.
    await expect(page.getByRole('banner').getByText('Bodega Principal')).toBeVisible();

    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    expect(failedRequests, failedRequests.join('\n')).toEqual([]);
  });

  test('cambiar de sucursal desde el header filtra los datos mostrados', async ({ page }) => {
    await login(page);
    if (page.url().includes('/sucursales')) {
      await page.getByText('Bodega Principal', { exact: false }).first().click();
    }
    await page.waitForURL(/\/dashboard/);

    await page.getByRole('button', { name: /Seleccionar sucursal|Bodega Principal/ }).click();
    await page.getByRole('option', { name: /Tienda Centro/ }).click();

    // Branch switch shows a brief loading beat, then the new branch name renders in the header.
    await expect(page.getByRole('banner').getByText('Tienda Centro')).toBeVisible();

    // Barriles page should reflect the new branch's subtitle.
    await page.getByRole('link', { name: 'Barriles' }).click();
    await expect(page.getByText(/en Tienda Centro/)).toBeVisible();
  });
});
