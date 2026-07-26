import {
  test as base,
  expect,
} from '@playwright/test';

import {
  RealWorldApiClient,
} from '../api/realworld-api.client';

import {
  getTestEnvironment,
} from '../config/environment';

interface ApiFixtures {
  realWorldApi: RealWorldApiClient;
}

export const test = base.extend<ApiFixtures>({
  realWorldApi: async ({ request }, use) => {
    const environment = getTestEnvironment();

    const apiClient = new RealWorldApiClient(
      request,
      environment.apiBaseUrl,
    );

    await use(apiClient);
  },
});

export { expect };