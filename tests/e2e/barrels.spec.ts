import { test, expect } from '@playwright/test';
import { loginAndSelectBranch, trackPageHealth } from './helpers';

test.describe('Barriles', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndSelectBranch(page);
    await page.getByRole('link', { name: 'Barriles' }).click();
    await expect(page.getByRole('heading', { name: 'Barriles' })).toBeVisible();
  });

  test('filtros por tipo y estado no rompen la página', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackPageHealth(page);
    await page.getByLabel('Filtrar por tipo de vino').selectOption({ label: 'Tinto' });
    await page.getByLabel('Filtrar por estado').selectOption({ label: 'En crianza' });
    // Either filtered cards or the empty state — both are valid, page must not crash.
    await expect(page.locator('body')).not.toContainText('Error');
    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
    expect(failedRequests, failedRequests.join('\n')).toEqual([]);
  });

  test('crear barril valida campos obligatorios antes de enviar', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo barril' }).click();
    await expect(page.getByRole('heading', { name: 'Nuevo barril' })).toBeVisible();

    // Submit empty — expect inline validation errors, not a silent failure or crash.
    await page.getByRole('button', { name: 'Crear barril' }).click();
    await expect(page.getByText('El código es obligatorio.')).toBeVisible();
    await expect(page.getByText('El varietal es obligatorio.')).toBeVisible();
    await expect(page.getByText('La fecha de llenado es obligatoria.')).toBeVisible();
  });

  test('crear barril con datos válidos lo agrega a la lista', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo barril' }).click();
    const code = `QA-${Date.now().toString().slice(-6)}`;
    await page.getByLabel('Código').fill(code);
    await page.getByLabel('Varietal').fill('Cabernet Sauvignon QA');
    await page.getByLabel('Capacidad (L)').fill('225');
    await page.getByLabel('Llenado actual (L)').fill('180');
    await page.getByLabel('Fecha de llenado').fill('2024-01-15');
    await page.getByRole('button', { name: 'Crear barril' }).click();

    await expect(page.getByRole('heading', { name: 'Nuevo barril' })).toHaveCount(0);
    await expect(page.getByText(code)).toBeVisible();
  });

  test('editar un barril existente persiste los cambios', async ({ page }) => {
    // Clear filters left over from a previous test in this worker.
    await page.getByLabel('Filtrar por tipo de vino').selectOption('todos');
    await page.getByLabel('Filtrar por estado').selectOption('todos');

    const editButton = page.getByRole('button', { name: /^Editar barril/ }).first();
    await editButton.click();
    await expect(page.getByRole('heading', { name: 'Editar barril' })).toBeVisible();

    await page.getByLabel('Varietal').fill('Malbec Editado QA');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();

    await expect(page.getByRole('heading', { name: 'Editar barril' })).toHaveCount(0);
    await expect(page.getByText('Malbec Editado QA')).toBeVisible();
  });
});
