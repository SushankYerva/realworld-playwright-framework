import {
  test,
  expect,
} from '../../src/fixtures/authorization.fixture';

test.describe(
  'Article account isolation',
  () => {
    test(
      'one account cannot access or delete another account article @security @api',
      async ({
        authorizationScenario,
      }) => {
        const {
          article,
          owner,
          otherUser,
          ownerApi,
          otherUserApi,
        } = authorizationScenario;

        await test.step(
          'Verify the article belongs to its owner',
          async () => {
            const ownerArticle =
              await ownerApi.getArticle(
                article.slug,
                owner.token,
              );

            expect(ownerArticle.slug).toBe(
              article.slug,
            );

            expect(
              ownerArticle.author.username,
            ).toBe(owner.username);
          },
        );

        await test.step(
          'Verify another account cannot access the article',
          async () => {
            const status =
              await otherUserApi.getArticleStatus(
                article.slug,
                otherUser.token,
              );

            expect(status).toBe(404);
          },
        );

        await test.step(
          'Verify another account cannot delete the article',
          async () => {
            const status =
              await otherUserApi.deleteArticleStatus(
                otherUser.token,
                article.slug,
              );

            expect(status).toBe(404);
          },
        );

        await test.step(
          'Verify the unauthorized request did not remove the article',
          async () => {
            const ownerArticle =
              await ownerApi.getArticle(
                article.slug,
                owner.token,
              );

            expect(ownerArticle.slug).toBe(
              article.slug,
            );

            expect(
              ownerArticle.author.username,
            ).toBe(owner.username);
          },
        );
      },
    );
  },
);