import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'https://significant-darcey-kwikicity-3dda52ea.koyeb.app',
    headless: !!process.env.CI, // ✅ CI = headless, local = headed
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    // ✅ Runs first: creates logged-in session storageState
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ✅ Real tests reuse the session created in "setup"
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'storageState.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'storageState.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'storageState.json' },
      dependencies: ['setup'],
    },
  ],
});
