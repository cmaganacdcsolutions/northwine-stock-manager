import { defineConfig, devices } from '@playwright/test';

/**
 * QA suite for the North Wine Stock Manager demo.
 * Builds the production bundle and serves it via `vite preview` so the demo
 * is tested exactly as it will be shown to the CEO (no dev-server overlays).
 */
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      // Runs the full functional + a11y + responsive(*) suite. Sidebar nav is
      // permanently visible at this width (breakpoint is 900px, see
      // Sidebar.module.css), which every functional spec assumes.
      // (*) responsive.spec.ts sets its own 390x844 viewport per-test via
      // `test.use`, independent of this project's viewport.
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      // Screenshot-only pass at the mobile breakpoint. Functional specs are
      // desktop-nav-only and are intentionally NOT run here — they'd fail
      // trying to click sidebar links that are off-canvas until the burger
      // menu is opened (screenshots.spec.ts handles that itself).
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
      testMatch: /screenshots\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
