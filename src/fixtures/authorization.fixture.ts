import type { Article } from '../models/article.model';
import type { RegisteredUser } from '../models/user.model';
import { getTestEnvironment, } from '../config/environment';

import { RealWorldApiClient } from '../api/realworld-api.client';

import {
  test as apiTest,
  expect,
} from './api.fixture';

import {
  createUniqueArticle,
  createUniqueUser,
} from '../utils/test-data.factory';

const environment = getTestEnvironment();

export interface AuthorizationScenario {
  article: Article;
  owner: RegisteredUser;
  otherUser: RegisteredUser;
  ownerApi: RealWorldApiClient;
  otherUserApi: RealWorldApiClient;
}

interface AuthorizationFixtures {
  authorizationScenario: AuthorizationScenario;
}

export const test =
  apiTest.extend<AuthorizationFixtures>({
    authorizationScenario: async (
      { playwright },
      use,
    ) => {
      /*
       * Each actor receives a separate request context
       * and therefore a separate cookie store.
       */
      const ownerRequest =
        await playwright.request.newContext();

      const otherUserRequest =
        await playwright.request.newContext();

      const ownerApi =
        new RealWorldApiClient(
          ownerRequest,
          environment.apiBaseUrl,
        );

      const otherUserApi =
        new RealWorldApiClient(
          otherUserRequest,
          environment.apiBaseUrl,
        );

      let owner: RegisteredUser | undefined;
      let article: Article | undefined;

      try {
        owner =
          await ownerApi.registerUser(
            createUniqueUser(),
          );

        article =
          await ownerApi.createArticle(
            owner.token,
            createUniqueArticle(),
          );

        const otherUser =
          await otherUserApi.registerUser(
            createUniqueUser(),
          );

        await use({
          article,
          owner,
          otherUser,
          ownerApi,
          otherUserApi,
        });
      } finally {
        try {
          if (owner && article) {
            await ownerApi.deleteArticle(
              owner.token,
              article.slug,
            );
          }
        } finally {
          await Promise.all([
            ownerRequest.dispose(),
            otherUserRequest.dispose(),
          ]);
        }
      }
    },
  });

export { expect };