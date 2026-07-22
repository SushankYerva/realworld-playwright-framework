import type {
  Locator,
  Page,
} from '@playwright/test';

export class EditorPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagInput: Locator;
  readonly publishButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.titleInput =
      page.getByPlaceholder('Article Title');

    this.descriptionInput =
      page.getByPlaceholder(
        "What's this article about?",
      );

    this.bodyInput =
      page.getByPlaceholder(
        'Write your article (in markdown)',
      );

    this.tagInput =
      page.getByPlaceholder('Enter tags');

    this.publishButton =
      page.getByRole('button', {
        name: 'Publish Article',
      });
  }

  async updateTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async publish(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/article\//),
      this.publishButton.click(),
    ]);
  }
}