import {
  test,
  expect,
} from '../../src/fixtures/api.fixture';

import { createUniqueUser } from '../../src/utils/test-data.factory';

test.describe('Users API', () => {
  test(
    'registers a unique user',
    {
        tag: [
          '@api',
        ],
    },
    async ({ realWorldApi }) => {
      const newUser = createUniqueUser();

      const registeredUser =
        await realWorldApi.registerUser(newUser);

      expect(registeredUser.username).toBe(
        newUser.username,
      );

      expect(registeredUser.email).toBe(
        newUser.email,
      );

      expect(registeredUser.token).toBeTruthy();

      const currentUser =
        await realWorldApi.getCurrentUser(
          registeredUser.token,
        );

      expect(currentUser.username).toBe(
        newUser.username,
      );
    },
  );
});