import type {
  Locator,
  Page,
} from '@playwright/test';

export class ArticlePage {
  readonly page: Page;
  readonly articleTitle: Locator;
  readonly articleContent: Locator;
  readonly editArticleLink: Locator;
  readonly deleteArticleButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.articleTitle = page.getByRole(
      'heading',
      {
        level: 1,
      },
    );

    this.articleContent =
      page.locator('.article-content');

    this.editArticleLink = page
      .getByRole('link', {
        name: /Edit Article/i,
      })
      .first();

    this.deleteArticleButton = page
      .getByRole('button', {
        name: /Delete Article/i,
      })
      .first();
  }

  async open(slug: string): Promise<void> {
    await this.page.goto(
      `/article/${encodeURIComponent(slug)}`,
    );
  }

  async openEditor(): Promise<void> {
    await this.editArticleLink.click();

    await this.page.waitForURL(/\/editor\//);
  }

  async deleteArticle(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => {
        return new URL(url).pathname === '/';
      }),

      this.deleteArticleButton.click(),
    ]);
  }

  getCurrentSlug(): string {
    const pathname = new URL(this.page.url()).pathname;

    const slug = pathname
      .split('/article/')
      .at(1);

    if (!slug) {
      throw new Error(
        `Article slug could not be extracted from ${this.page.url()}`,
      );
    }

    return decodeURIComponent(slug);
  }
}