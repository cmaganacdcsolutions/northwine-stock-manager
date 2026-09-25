import { test } from '@playwright/test';
import { login, loginAndSelectBranch } from './helpers';

/**
 * Captures a full-page screenshot per screen for manual visual review.
 * Runs once per project (desktop 1440x900 / mobile 390x844 — see
 * playwright.config.ts) so files land in tests/e2e/__screenshots__/<project>/.
 */
async function shoot(page: import('@playwright/test').Page, projectName: string, name: string) {
  await page.screenshot({
    path: `tests/e2e/__screenshots__/${projectName}/${name}.png`,
    fullPage: true,
  });
}

/**
 * Navigates via the sidebar, opening the mobile off-canvas menu first if needed.
 * NOTE: the sidebar nav link stays CSS-"visible" (not display:none) even when
 * off-canvas via transform, so `link.isVisible()` can't detect that case — the
 * burger "menuButton" is real display:none/inline-flex per breakpoint, so we
 * check that instead.
 */
async function goToNav(page: import('@playwright/test').Page, label: string) {
  const menuButton = page.getByRole('button', { name: 'Abrir menú de navegación' });
  if (await menuButton.isVisible().catch(() => false)) {
    await menuButton.click();
  }
  await page.getByRole('link', { name: label }).click();
}

test.describe('Screenshots de referencia', () => {
  test('captura todas las pantallas', async ({ page }, testInfo) => {
    const proj = testInfo.project.name;

    await page.goto('/login');
    await shoot(page, proj, '01-login');

    await login(page);
    await shoot(page, proj, '02-seleccion-sucursal');

    await page.getByText('Bodega Principal', { exact: false }).first().click();
    await page.waitForURL(/\/dashboard/);
    await shoot(page, proj, '03-dashboard');

    await goToNav(page, 'Barriles');
    await shoot(page, proj, '04-barriles');

    await page.getByRole('button', { name: 'Nuevo barril' }).click();
    await shoot(page, proj, '04b-barriles-modal-nuevo');
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await goToNav(page, 'Vinos y añejados');
    await shoot(page, proj, '05-vinos');

    await goToNav(page, 'Órdenes a proveedor');
    await shoot(page, proj, '06-ordenes');

    await goToNav(page, 'Movimientos');
    await shoot(page, proj, '07-movimientos');

    await goToNav(page, 'Ajustes');
    await shoot(page, proj, '08-ajustes');
  });
});
