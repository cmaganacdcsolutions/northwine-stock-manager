import { test, expect } from '@playwright/test';
import { loginAndSelectBranch, trackPageHealth } from './helpers';

test.describe('Movimientos', () => {
  test('lista de movimientos renderiza sin errores (lectura, sin acciones de edición)', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackPageHealth(page);
    await loginAndSelectBranch(page);
    await page.getByRole('link', { name: 'Movimientos' }).click();
    await expect(page.getByRole('heading', { name: 'Movimientos' })).toBeVisible();

    // Read-only log: no edit/delete controls should exist on this page.
    await expect(page.getByRole('button', { name: /editar|eliminar/i })).toHaveCount(0);

    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    expect(failedRequests, failedRequests.join('\n')).toEqual([]);
  });
});
