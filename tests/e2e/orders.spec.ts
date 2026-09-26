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
    // sessionStorage (read-only-to-src technique) to verify the "Retrasada" state renders.
    await page.evaluate(() => {
      const raw = window.sessionStorage.getItem('nw:orders');
      const orders = raw ? JSON.parse(raw) : [];
      const target = orders.find(
        (o: { status: string }) => o.status === 'en_transito' || o.status === 'enviada',
      );
      if (target) {
        const past = new Date();
        past.setDate(past.getDate() - 5);
        target.etaDate = past.toISOString().slice(0, 10);
        window.sessionStorage.setItem('nw:orders', JSON.stringify(orders));
      }
    });
    await page.reload();
    await expect(page.getByText('Retrasada').first()).toBeVisible();
  });

  test('marcar orden como recibida pide confirmación antes de actualizar el estado', async ({ page }) => {
    const receiveButton = page.getByRole('button', { name: 'Marcar como recibida' }).first();
    await expect(receiveButton).toBeVisible();
    await receiveButton.click();

    // Confirmation modal (STOCK_MANAGER_SPEC.md §6 / QA_REPORT.md P2-1) — the
    // status update must not happen until the user confirms.
    const dialog = page.getByRole('dialog', { name: 'Confirmar recepción' });
    await expect(dialog).toBeVisible();
    await expect(page.getByText(/Recibida el/).first()).toHaveCount(0);

    await dialog.getByRole('button', { name: 'Sí, marcar como recibida' }).click();

    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(/Recibida el/).first()).toBeVisible();
  });

  test('cancelar la confirmación de "Marcar como recibida" no cambia el estado de la orden', async ({ page }) => {
    const receiveButton = page.getByRole('button', { name: 'Marcar como recibida' }).first();
    await receiveButton.click();

    const dialog = page.getByRole('dialog', { name: 'Confirmar recepción' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancelar' }).click();

    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(/Recibida el/)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Marcar como recibida' }).first()).toBeVisible();
  });

  test('filtro por estado de orden no rompe la página', async ({ page }) => {
    await page.getByLabel('Filtrar por estado de orden').selectOption({ label: 'Recibida' });
    await expect(page.locator('body')).not.toContainText('Uncaught');
  });
});
