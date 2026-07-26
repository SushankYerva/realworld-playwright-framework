import {
  test,
  expect,
} from '../../../src/fixtures/article.fixture';

import { ArticlePage } from '../../../src/pages/article.page';
import { EditorPage } from '../../../src/pages/editor.page';

test.describe('Article lifecycle', () => {
  test(
    'author can read, update and delete an article',
    {
      tag: [
        '@regression',
        '@ui',
        '@authenticated',
      ],
    },
    async ({
      page,
      realWorldApi,
      authToken,
      managedArticle,
    }) => {
      const originalArticle =
        managedArticle.article;

      const articlePage =
        new ArticlePage(page);

      const editorPage =
        new EditorPage(page);

      await test.step(
        'Read the API-created article through the UI',
        async () => {
          await articlePage.open(
            originalArticle.slug,
          );

          await expect(
            articlePage.articleTitle,
          ).toHaveText(originalArticle.title);

          await expect(
            articlePage.articleContent,
          ).toContainText(originalArticle.body);

          await expect(
            articlePage.editArticleLink,
          ).toBeVisible();

          await expect(
            articlePage.deleteArticleButton,
          ).toBeVisible();
        },
      );

      const updatedTitle =
        `${originalArticle.title} updated`;

      await test.step(
        'Update the article through the UI',
        async () => {
          await articlePage.openEditor();

          await expect(
            editorPage.titleInput,
          ).toHaveValue(originalArticle.title);

          await editorPage.updateTitle(
            updatedTitle,
          );

          await editorPage.publish();

          await expect(
            articlePage.articleTitle,
          ).toHaveText(updatedTitle);
        },
      );

      const updatedSlug =
        articlePage.getCurrentSlug();

      managedArticle.setCurrentSlug(
        updatedSlug,
      );

      await test.step(
        'Verify the UI update through the API',
        async () => {
          const articleFromApi =
            await realWorldApi.getArticle(
              updatedSlug,
              authToken,
            );

          expect(articleFromApi.title).toBe(
            updatedTitle,
          );

          expect(articleFromApi.body).toBe(
            originalArticle.body,
          );
        },
      );

      await test.step(
        'Delete the article through the UI',
        async () => {
          await articlePage.deleteArticle();

          await expect(page).toHaveURL(
            /\/$/,
          );
        },
      );

      await test.step(
        'Verify deletion through the API',
        async () => {
          const articleStillExists =
            await realWorldApi.articleExists(
              updatedSlug,
              authToken,
            );

          expect(articleStillExists).toBe(false);
        },
      );
    },
  );
});