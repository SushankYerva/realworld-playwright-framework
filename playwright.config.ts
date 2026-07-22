import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.BASE_URL ?? 'https://demo.realworld.show';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  // Keep CI load conservative while using a public demo application.
  workers: process.env.CI ? 1 : undefined,

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'reports/html',
        open: 'never',
      },
    ],
    [
      'junit',
      {
        outputFile: 'reports/junit/results.xml',
      },
    ],
  ],

  use: {
    baseURL,

    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  outputDir: 'test-results/artifacts',

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});