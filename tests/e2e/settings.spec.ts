import { test, expect } from '@playwright/test';
import { loginAndSelectBranch } from './helpers';

test.describe('Ajustes', () => {
  test('restablecer datos demo pide confirmación y recarga con datos originales', async ({ page }) => {
    await loginAndSelectBranch(page);
    await page.getByRole('link', { name: 'Ajustes' }).click();
    await expect(page.getByRole('heading', { name: 'Ajustes' })).toBeVisible();

    await page.getByRole('button', { name: 'Restablecer datos demo' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Confirmar restablecimiento' })).toBeVisible();

    // Cancel path must not wipe data.
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByRole('alertdialog')).toHaveCount(0);

    // Confirm path resets and reloads — session survives (sessionStorage untouched),
    // active branch selection is expected to survive the reload too.
    await page.getByRole('button', { name: 'Restablecer datos demo' }).click();
    await page.getByRole('button', { name: 'Sí, restablecer' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/ajustes/);
    await expect(page.getByRole('heading', { name: 'Ajustes' })).toBeVisible();
  });
});
