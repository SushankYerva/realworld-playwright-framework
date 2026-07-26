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
    const encodedSlug = encodeURIComponent(slug);

    const articleResponsePromise =
      this.page.waitForResponse(
        (response) => {
          const url = new URL(response.url());

          return (
            response.request().method() === 'GET' &&
            url.pathname.endsWith(
              `/api/articles/${encodedSlug}`,
            )
          );
        },
        {
          timeout: 20_000,
        },
      );

    const navigationResponse = await this.page.goto(
      `/article/${encodedSlug}`,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    if (
      navigationResponse &&
      !navigationResponse.ok()
    ) {
      throw new Error(
        `Article page navigation failed with HTTP ${navigationResponse.status()}`,
      );
    }

    const articleResponse =
      await articleResponsePromise;

    if (!articleResponse.ok()) {
  const responseBody =
    await articleResponse.text();

  const requestHeaders =
    await articleResponse
      .request()
      .allHeaders();

  throw new Error(
      [
        `Article API request failed for ${slug}.`,
        `Request URL: ${articleResponse.url()}.`,
        `HTTP status: ${articleResponse.status()}.`,
        `Authorization header present: ${
          Boolean(requestHeaders.authorization)
        }.`,
        `Response: ${responseBody}`,
      ].join(' '),
    );
  }

    await this.articleTitle.waitFor({
      state: 'visible',
      timeout: 15_000,
    });
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


  authorLink(username: string): Locator {
    return this.page
      .getByRole('link', {
        name: username,
        exact: true,
      })
      .first();
  }
}