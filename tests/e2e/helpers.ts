import type { Page, ConsoleMessage, Request } from '@playwright/test';

export const VALID_USER = 'admin';
export const VALID_PASS = 'admin123';

/** Collects console errors + failed network requests for a page for the duration of a test. */
export function trackPageHealth(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req: Request) => {
    failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });

  return { consoleErrors, failedRequests };
}

/** Logs in with valid demo credentials and waits for navigation past the login gate. */
export async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Usuario', { exact: true }).fill(VALID_USER);
  await page.getByLabel('Contraseña', { exact: true }).fill(VALID_PASS);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL(/\/(sucursales|dashboard)/);
}

/** Logs in and selects the first available sucursal, landing on the Dashboard. */
export async function loginAndSelectBranch(page: Page, branchName = 'Bodega Principal') {
  await login(page);
  if (page.url().includes('/sucursales')) {
    await page.getByText(branchName, { exact: false }).first().click();
  }
  await page.waitForURL(/\/dashboard/);
}
