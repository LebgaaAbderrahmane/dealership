import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'off',
    trace: 'off',
  },
  projects: [
    { name: 'desktop-chrome', use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
    { name: 'mobile-iphone', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 } },
  ],
});
