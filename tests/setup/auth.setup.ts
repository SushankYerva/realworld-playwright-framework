import path from 'node:path';
import { mkdir } from 'node:fs/promises';

import {
  test as setup,
  expect,
} from '../../src/fixtures/api.fixture';

import { createUniqueUser } from '../../src/utils/test-data.factory';

const authFile = path.join(
  process.cwd(),
  'playwright',
  '.auth',
  'user.json',
);

setup(
  'create authenticated browser state',
  async ({ page, realWorldApi }) => {
    const newUser = createUniqueUser();

    const registeredUser =
      await realWorldApi.registerUser(newUser);

    // Confirm that the token is valid before using it.
    const currentUser =
      await realWorldApi.getCurrentUser(
        registeredUser.token,
      );

    expect(currentUser.username).toBe(
      newUser.username,
    );

    await mkdir(path.dirname(authFile), {
      recursive: true,
    });

    /*
     * Local storage belongs to a browser origin.
     * Therefore, navigate to the application before
     * inserting the JWT.
     */
    await page.goto('/');

    await page.evaluate(
      ({ token }) => {
        window.localStorage.setItem(
          'jwtToken',
          token,
        );
      },
      {
        token: registeredUser.token,
      },
    );

    /*
     * Reload so the application starts with the token
     * and retrieves the authenticated user.
     */
    await page.reload();

    await expect(
      page.getByRole('link', {
        name: 'New Article',
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: 'Settings',
      }),
    ).toBeVisible();

    await page.context().storageState({
      path: authFile,
    });
  },
);