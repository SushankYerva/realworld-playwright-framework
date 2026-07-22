import {
  test,
  expect,
} from '@playwright/test';

test.describe('Authenticated navigation', () => {
  test(
    'authenticated user sees protected navigation @smoke',
    async ({ page }) => {
      await page.goto('/');

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

      await expect(
        page.getByRole('link', {
          name: 'Sign in',
        }),
      ).toBeHidden();

      await expect(
        page.getByRole('link', {
          name: 'Sign up',
        }),
      ).toBeHidden();
    },
  );
});