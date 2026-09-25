import { test, expect } from '@playwright/test';
import { loginAndSelectBranch } from './helpers';

const ROUTES: Array<{ path: string; heading: string; navLabel?: string }> = [
  { path: '/dashboard', heading: 'Dashboard' },
  { path: '/barriles', heading: 'Barriles', navLabel: 'Barriles' },
  { path: '/vinos', heading: 'Vinos y añejados', navLabel: 'Vinos y añejados' },
  { path: '/ordenes', heading: 'Órdenes a proveedor', navLabel: 'Órdenes a proveedor' },
  { path: '/movimientos', heading: 'Movimientos', navLabel: 'Movimientos' },
  { path: '/ajustes', heading: 'Ajustes', navLabel: 'Ajustes' },
];

test.describe('Responsive @ 390x844', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('sidebar arranca colapsado y se abre/cierra con el botón de menú', async ({ page }) => {
    await loginAndSelectBranch(page);
    // The sidebar landmark is an <aside aria-label="Navegación principal">, which
    // exposes as role="complementary" (not "navigation") — see QA_REPORT.md P2
    // re: landmark semantics.
    const nav = page.getByRole('complementary', { name: 'Navegación principal' });
    await expect(nav).not.toBeInViewport();

    await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
    await expect(nav).toBeInViewport();

    await page.getByRole('button', { name: 'Cerrar menú' }).click();
    await expect(nav).not.toBeInViewport();
  });

  for (const route of ROUTES) {
    test(`sin overflow horizontal en ${route.path}`, async ({ page }) => {
      await loginAndSelectBranch(page);
      if (route.path !== '/dashboard') {
        await page.getByRole('button', { name: 'Abrir menú de navegación' }).click();
        await page.getByRole('link', { name: route.navLabel! }).click();
      }
      await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `document.scrollWidth (${scrollWidth}) exceeds viewport clientWidth (${clientWidth}) on ${route.path} — horizontal overflow`,
      ).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});
