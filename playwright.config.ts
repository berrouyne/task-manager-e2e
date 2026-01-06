import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // ❌ Disable full parallelism for stateful CRUD tests
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  // Retry twice in CI for extra safety
  retries: process.env.CI ? 2 : 0,

  // Single worker in CI (deterministic)
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'https://significant-darcey-kwikicity-3dda52ea.koyeb.app',

    // CI = headless, local = headed
    headless: !!process.env.CI,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    // ✅ Setup project: logs in and saves storageState.json
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ✅ Single browser for CRUD tests (STABLE)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storageState.json',
      },
      dependencies: ['setup'],
    },
  ],
});
