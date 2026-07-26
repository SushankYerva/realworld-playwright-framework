export type TestEnvironmentName =
  | 'demo'
  | 'local'
  | 'qa'
  | 'staging';

export interface TestEnvironment {
  name: TestEnvironmentName;
  webBaseUrl: string;
  apiBaseUrl: string;
}

const demoEnvironment: TestEnvironment = {
  name: 'demo',
  webBaseUrl: 'https://demo.realworld.show',
  apiBaseUrl: 'https://api.realworld.show/api',
};

export function getTestEnvironment(): TestEnvironment {
  const environmentName =
    (process.env.TEST_ENV ??
      'demo') as TestEnvironmentName;

  if (environmentName === 'demo') {
    return {
      name: environmentName,
      webBaseUrl:
        process.env.BASE_URL ??
        demoEnvironment.webBaseUrl,
      apiBaseUrl:
        process.env.API_URL ??
        demoEnvironment.apiBaseUrl,
    };
  }

  const webBaseUrl = process.env.BASE_URL;
  const apiBaseUrl = process.env.API_URL;

  if (!webBaseUrl || !apiBaseUrl) {
    throw new Error(
      [
        `Environment "${environmentName}" requires`,
        'BASE_URL and API_URL environment variables.',
      ].join(' '),
    );
  }

  return {
    name: environmentName,
    webBaseUrl,
    apiBaseUrl,
  };
}