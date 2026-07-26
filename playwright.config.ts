import path from 'node:path';

import {
  defineConfig,
  devices,
} from '@playwright/test';

import {
  getTestEnvironment,
} from './src/config/environment';

const environment = getTestEnvironment();

const authFile = path.join(
  process.cwd(),
  'playwright',
  '.auth',
  'user.json',
);

export default defineConfig({
  testDir: './tests',

  /* Public RealWorld API becomes unstable under heavy parallel load. */
  workers: 1,

  fullyParallel: false,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  timeout: 30_000,

  expect: {
    timeout: 10_000,
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

  outputDir: 'test-results/artifacts',

  use: {
    baseURL: environment.webBaseUrl,

    actionTimeout: 10_000,
    navigationTimeout: 20_000,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    ignoreHTTPSErrors: false,
  },

  projects: [
    /*
     * Creates a fresh user and reusable authenticated
     * browser state before authenticated test projects.
     */
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',

      use: {
        ...devices['Desktop Chrome'],
      },
    },

    /*
     * Direct API tests run once and are not repeated
     * for each browser engine.
     */
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      testIgnore: '**/*.setup.ts',
    },

    /*
     * Anonymous Chromium tests.
     */
    {
      name: 'chromium-anonymous',

      testMatch: [
        '**/ui/smoke/**/*.spec.ts',
        '**/ui/regression/**/*.spec.ts',
      ],

      use: {
        ...devices['Desktop Chrome'],
      },
    },

    /*
     * Anonymous Firefox tests.
     */
    {
      name: 'firefox-anonymous',

      testMatch: [
        '**/ui/smoke/**/*.spec.ts',
        '**/ui/regression/**/*.spec.ts',
      ],

      use: {
        ...devices['Desktop Firefox'],
      },
    },

    /*
     * Anonymous WebKit/Safari tests.
     */
    {
      name: 'webkit-anonymous',

      testMatch: [
        '**/ui/smoke/**/*.spec.ts',
        '**/ui/regression/**/*.spec.ts',
      ],

      use: {
        ...devices['Desktop Safari'],
      },
    },

    /*
     * Authenticated Chromium tests.
     */
    {
      name: 'chromium-authenticated',

      testMatch:
        '**/ui/authenticated/**/*.spec.ts',

      dependencies: ['setup'],

      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
    },

    /*
     * Authenticated Firefox tests.
     */
    {
      name: 'firefox-authenticated',

      testMatch:
        '**/ui/authenticated/**/*.spec.ts',

      dependencies: ['setup'],

      use: {
        ...devices['Desktop Firefox'],
        storageState: authFile,
      },
    },

    /*
     * Authenticated WebKit/Safari tests.
     */
    {
      name: 'webkit-authenticated',

      testMatch:
        '**/ui/authenticated/**/*.spec.ts',

      dependencies: ['setup'],

      use: {
        ...devices['Desktop Safari'],
        storageState: authFile,
      },
    },
  ],
});