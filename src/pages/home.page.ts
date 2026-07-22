import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly brandLink: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly globalFeedTab: Locator;
  readonly popularTagsHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.brandLink = page
      .getByRole('link', { name: 'conduit' })
      .first();

    this.signInLink = page.getByRole('link', {
      name: 'Sign in',
    });

    this.signUpLink = page.getByRole('link', {
      name: 'Sign up',
    });

    this.globalFeedTab = page.getByRole('link', {
      name: 'Global Feed',
    });

    this.popularTagsHeading = page.getByText('Popular Tags', {
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }
}