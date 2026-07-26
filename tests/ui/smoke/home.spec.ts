import { expect, test } from '@playwright/test';
import { HomePage } from '../../../src/pages/home.page';

test.describe('RealWorld home page', () => {
  test(
    'anonymous user can access the application',
    {
      tag: ['@smoke', '@ui'],
    },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await test.step('Open the RealWorld home page', async () => {
        await homePage.open();
      });

      await test.step(
        'Verify anonymous navigation options',
        async () => {
          await expect(homePage.brandLink).toBeVisible();
          await expect(homePage.signInLink).toBeVisible();
          await expect(homePage.signUpLink).toBeVisible();
        },
      );

      await test.step('Verify public content areas', async () => {
        await expect(homePage.globalFeedTab).toBeVisible();
        await expect(
          homePage.popularTagsHeading,
        ).toBeVisible();
      });

      await expect(page).toHaveTitle(/Conduit/i);
    },
  );
});