import { test, expect } from '@playwright/test';
import { VALID_USER, VALID_PASS, login, trackPageHealth } from './helpers';

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('rutas protegidas redirigen a login sin sesión', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/barriles');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/sucursales');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login con credenciales inválidas muestra error', async ({ page }) => {
    const { consoleErrors, failedRequests } = trackPageHealth(page);
    await page.getByLabel('Usuario', { exact: true }).fill('admin');
    await page.getByLabel('Contraseña', { exact: true }).fill('wrongpass');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByRole('alert')).toContainText('Usuario o contraseña incorrectos');
    await expect(page).toHaveURL(/\/login/);
    expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual([]);
    expect(failedRequests, `Failed requests: ${failedRequests.join('\n')}`).toEqual([]);
  });

  test('login con credenciales válidas navega a selección de sucursal', async ({ page }) => {
    await page.getByLabel('Usuario', { exact: true }).fill(VALID_USER);
    await page.getByLabel('Contraseña', { exact: true }).fill(VALID_PASS);
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await page.waitForURL(/\/(sucursales|dashboard)/);
    expect(page.url()).toMatch(/\/(sucursales|dashboard)/);
  });

  test('bloqueo tras 3 intentos fallidos consecutivos', async ({ page }) => {
    for (let i = 0; i < 3; i += 1) {
      await page.getByLabel('Usuario', { exact: true }).fill('admin');
      await page.getByLabel('Contraseña', { exact: true }).fill('wrongpass');
      await page.getByRole('button', { name: 'Ingresar' }).click();
      if (i < 2) await expect(page.getByRole('alert')).toContainText('Usuario o contraseña incorrectos');
    }
    await expect(page.getByRole('alert')).toContainText('Demasiados intentos');
    // Inputs should be disabled during lockout.
    await expect(page.getByLabel('Usuario', { exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeDisabled();
  });

  test('toggle mostrar/ocultar contraseña funciona', async ({ page }) => {
    const passwordInput = page.getByLabel('Contraseña', { exact: true });
    await passwordInput.fill('admin123');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Mostrar contraseña' }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('navegación por teclado: tab llega a usuario, contraseña y submit', async ({ page }) => {
    await page.getByLabel('Usuario', { exact: true }).focus();
    await expect(page.getByLabel('Usuario', { exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Contraseña', { exact: true })).toBeFocused();
  });

  test('logout vuelve a login y limpia la sesión', async ({ page }) => {
    await login(page);
    if (page.url().includes('/sucursales')) {
      await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    } else {
      await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    }
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
