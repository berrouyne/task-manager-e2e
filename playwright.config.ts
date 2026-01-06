import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if test.only is left */
  forbidOnly: !!process.env.CI,

  /* Retry only on CI */
  retries: process.env.CI ? 2 : 0,

  /* Workers */
  workers: process.env.CI ? 1 : undefined,

  /* Test report */
  reporter: 'html',

  /* Shared settings for all projects */
  use: {
    /* 🔑 BASE URL — THIS FIXES YOUR ERROR */
    baseURL: 'https://significant-darcey-kwikicity-3dda52ea.koyeb.app',

    /* Show browser locally (good for learning & debugging) */
    headless: false,

    /* Evidence for failures */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Collect trace on first retry */
    trace: 'on-first-retry',
  },

  /* Configure browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
