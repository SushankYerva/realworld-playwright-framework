import type { Article } from '../models/article.model';

import {
  test as apiTest,
  expect,
} from './api.fixture';

import { readJwtToken } from '../utils/auth-state';
import { createUniqueArticle } from '../utils/test-data.factory';

export interface ManagedArticle {
  article: Article;
  setCurrentSlug(slug: string): void;
}

interface ArticleFixtures {
  authToken: string;
  managedArticle: ManagedArticle;
}

export const test = apiTest.extend<ArticleFixtures>({
  authToken: async ({}, use) => {
    const token = await readJwtToken();

    await use(token);
  },

  managedArticle: async (
    {
      realWorldApi,
      authToken,
    },
    use,
  ) => {
    const articleData = createUniqueArticle();

    const article = await realWorldApi.createArticle(
      authToken,
      articleData,
    );

    let currentSlug = article.slug;

    await use({
      article,

      setCurrentSlug(slug: string): void {
        currentSlug = slug;
      },
    });

    /*
     * Cleanup executes even if the test fails.
     * deleteArticle safely accepts an already deleted article.
     */
    await realWorldApi.deleteArticle(
      authToken,
      currentSlug,
    );

    if (currentSlug !== article.slug) {
      await realWorldApi.deleteArticle(
        authToken,
        article.slug,
      );
    }
  },
});

export { expect };