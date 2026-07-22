import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
const baseURL =
  process.env.BASE_URL ?? 'https://demo.realworld.show';
const authFile = path.join(
  process.cwd(),
  'playwright',
  '.auth',
  'user.json',
);
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
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'api',
      testMatch: /.*\/api\/.*\.spec\.ts/,
    },

    {
      name: 'chromium-anonymous',
      testMatch:
        /.*\/ui\/(smoke|regression)\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'chromium-authenticated',
      testMatch:
        /.*\/ui\/authenticated\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
    },
  ],
});