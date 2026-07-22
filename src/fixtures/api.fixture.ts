import {
  test as base,
  expect,
} from '@playwright/test';

import { RealWorldApiClient } from '../api/realworld-api.client';

interface ApiFixtures {
  realWorldApi: RealWorldApiClient;
}

export const test = base.extend<ApiFixtures>({
  realWorldApi: async ({ request }, use) => {
    const apiClient = new RealWorldApiClient(request);

    await use(apiClient);
  },
});

export { expect };