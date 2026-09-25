import { test, expect } from '@playwright/test';
import { loginAndSelectBranch, trackPageHealth } from './helpers';

test.describe('Dashboard', () => {
  test('KPIs, gráfico y panel de alertas renderizan sin errores', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackPageHealth(page);
    await loginAndSelectBranch(page);

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // KPI cards (StatCards)
    await expect(page.getByText('Litros en barrica')).toBeVisible();
    await expect(page.getByText('Botellas en stock')).toBeVisible();
    await expect(page.getByText('Órdenes en tránsito')).toBeVisible();
    await expect(page.getByText('Valor de inventario')).toBeVisible();

    // recharts bar chart renders an svg with bars, or the empty state if no stock.
    const chartSvg = page.locator('.recharts-wrapper svg');
    const emptyChart = page.getByText('Sin stock cargado');
    await expect(chartSvg.or(emptyChart)).toBeVisible({ timeout: 10_000 });

    // Alerts panel headings
    await expect(page.getByText('Stock bajo')).toBeVisible();
    await expect(page.getByText('Llegadas próximas')).toBeVisible();

    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    expect(failedRequests, failedRequests.join('\n')).toEqual([]);
  });
});
