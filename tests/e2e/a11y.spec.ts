import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { login, loginAndSelectBranch } from './helpers';

/**
 * Accessibility smoke pass on 4 representative screens using axe-core.
 * Only "serious"/"critical" violations fail the run — moderate/minor findings
 * are reported in QA_REPORT.md as follow-ups, not release blockers.
 */
async function assertNoSeriousViolations(page: import('@playwright/test').Page, screenName: string) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious, `${screenName} — serious/critical a11y violations:\n${JSON.stringify(serious, null, 2)}`).toEqual(
    [],
  );
}

test.describe('Accesibilidad (axe-core, serious/critical)', () => {
  test('Login', async ({ page }) => {
    await page.goto('/login');
    await assertNoSeriousViolations(page, 'Login');
  });

  test('Selección de sucursal', async ({ page }) => {
    await login(page);
    await assertNoSeriousViolations(page, 'Selección de sucursal');
  });

  test('Dashboard', async ({ page }) => {
    await loginAndSelectBranch(page);
    await assertNoSeriousViolations(page, 'Dashboard');
  });

  test('Barriles (con modal de creación abierto)', async ({ page }) => {
    await loginAndSelectBranch(page);
    await page.getByRole('link', { name: 'Barriles' }).click();
    await page.getByRole('button', { name: 'Nuevo barril' }).click();
    await assertNoSeriousViolations(page, 'Barriles — modal Nuevo barril');
  });
});
