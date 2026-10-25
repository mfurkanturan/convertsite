import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  ...(process.env.PLAYWRIGHT_BASE_URL ? {} : {
    webServer: {
      command: 'pnpm --filter @convertsite/web dev',
      url: 'http://127.0.0.1:4321/tr/',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  }),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'safari-webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-safari-webkit',
      use: { ...devices['iPhone 13'] },
    },
    ...(process.platform === 'win32' ? [{ name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' as const } }] : []),
  ],
});
