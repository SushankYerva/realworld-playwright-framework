import {
  test,
  expect,
} from '@playwright/test';

const protectedRoutes = [
  '/editor',
  '/settings',
];

test.describe(
  'Protected route authorization',
  () => {
    for (const route of protectedRoutes) {
      test(
        `anonymous user cannot access ${route} @security @regression`,
        async ({ page }) => {
          await test.step(
            `Attempt to open ${route}`,
            async () => {
              await page.goto(route);
            },
          );

          await test.step(
            'Verify redirection to sign-in',
            async () => {
              await expect(page).toHaveURL(
                /\/login(?:\?.*)?$/,
              );

              await expect(
                page.getByRole('button', {
                  name: 'Sign in',
                }),
              ).toBeVisible();
            },
          );
        },
      );
    }
  },
);