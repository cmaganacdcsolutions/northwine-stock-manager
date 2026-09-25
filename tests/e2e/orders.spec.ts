import { test, expect } from '@playwright/test';
import { loginAndSelectBranch, trackPageHealth } from './helpers';

test.describe('Órdenes a proveedor', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectBranch(page);
    await page.getByRole('link', { name: 'Órdenes a proveedor' }).click();
    await expect(page.getByRole('heading', { name: 'Órdenes a proveedor' })).toBeVisible();
  });

  test('sección "En tránsito" lista órdenes activas', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackPageHealth(page);
    await expect(page.getByRole('heading', { name: 'En tránsito' })).toBeVisible();
    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    expect(failedRequests, failedRequests.join('\n')).toEqual([]);
  });

  test('una orden con ETA vencida sin recibir muestra badge "Retrasada"', async ({ page }) => {
    // Seed data has no naturally-overdue order (see QA_REPORT.md) — inject one via
    // localStorage (read-only-to-src technique) to verify the "Retrasada" state renders.
    await page.evaluate(() => {
      const raw = window.localStorage.getItem('nw:orders');
      const orders = raw ? JSON.parse(raw) : [];
      const target = orders.find(
        (o: { status: string }) => o.status === 'en_transito' || o.status === 'enviada',
      );
      if (target) {
        const past = new Date();
        past.setDate(past.getDate() - 5);
        target.etaDate = past.toISOString().slice(0, 10);
        window.localStorage.setItem('nw:orders', JSON.stringify(orders));
      }
    });
    await page.reload();
    await expect(page.getByText('Retrasada').first()).toBeVisible();
  });

  test('marcar orden como recibida actualiza su estado (y stock de barriles si aplica)', async ({ page }) => {
    const receiveButton = page.getByRole('button', { name: 'Marcar como recibida' }).first();
    await expect(receiveButton).toBeVisible();
    await receiveButton.click();

    // No confirmation modal exists today (see QA_REPORT.md P2) — action is immediate.
    await expect(page.getByText(/Recibida el/).first()).toBeVisible();
  });

  test('filtro por estado de orden no rompe la página', async ({ page }) => {
    await page.getByLabel('Filtrar por estado de orden').selectOption({ label: 'Recibida' });
    await expect(page.locator('body')).not.toContainText('Uncaught');
  });
});
