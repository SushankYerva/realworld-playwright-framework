import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

import type {
  Article,
  ArticleResponse,
  NewArticle,
  UpdateArticle,
} from '../models/article.model';

import type {
  NewUser,
  RegisteredUser,
  UserResponse,
} from '../models/user.model';

export class RealWorldApiClient {
  private readonly apiBaseUrl: string;

  constructor(
    private readonly request: APIRequestContext,
    apiBaseUrl =
      process.env.API_URL ??
      'https://api.realworld.show/api',
  ) {
    this.apiBaseUrl = apiBaseUrl.replace(/\/$/, '');
  }

  async registerUser(user: NewUser): Promise<RegisteredUser> {
    const response = await this.request.post(
      `${this.apiBaseUrl}/users`,
      {
        data: {
          user,
        },
      },
    );

    await this.validateResponse(
      response,
      'User registration',
    );

    const responseBody =
      (await response.json()) as UserResponse;

    if (!responseBody.user?.token) {
      throw new Error(
        'User registration response did not contain a token.',
      );
    }

    return responseBody.user;
  }

  async getCurrentUser(
    token: string,
  ): Promise<RegisteredUser> {
    const response = await this.request.get(
      `${this.apiBaseUrl}/user`,
      {
        headers: this.authHeaders(token),
      },
    );

    await this.validateResponse(
      response,
      'Get current user',
    );

    const responseBody =
      (await response.json()) as UserResponse;

    return responseBody.user;
  }

  async createArticle(
    token: string,
    article: NewArticle,
  ): Promise<Article> {
    const response = await this.request.post(
      `${this.apiBaseUrl}/articles`,
      {
        headers: this.authHeaders(token),
        data: {
          article,
        },
      },
    );

    await this.validateResponse(
      response,
      'Create article',
    );

    const responseBody =
      (await response.json()) as ArticleResponse;

    return responseBody.article;
  }

  async getArticle(
    slug: string,
    token?: string,
  ): Promise<Article> {
    const response = await this.request.get(
      `${this.apiBaseUrl}/articles/${encodeURIComponent(slug)}`,
      {
        headers: token
          ? this.authHeaders(token)
          : undefined,
      },
    );

    await this.validateResponse(
      response,
      `Get article ${slug}`,
    );

    const responseBody =
      (await response.json()) as ArticleResponse;

    return responseBody.article;
  }

  async updateArticle(
    token: string,
    slug: string,
    article: UpdateArticle,
  ): Promise<Article> {
    const response = await this.request.put(
      `${this.apiBaseUrl}/articles/${encodeURIComponent(slug)}`,
      {
        headers: this.authHeaders(token),
        data: {
          article,
        },
      },
    );

    await this.validateResponse(
      response,
      `Update article ${slug}`,
    );

    const responseBody =
      (await response.json()) as ArticleResponse;

    return responseBody.article;
  }

  async deleteArticle(
    token: string,
    slug: string,
  ): Promise<void> {
    const response = await this.request.delete(
      `${this.apiBaseUrl}/articles/${encodeURIComponent(slug)}`,
      {
        headers: this.authHeaders(token),
      },
    );

    // Makes cleanup safe when the test already deleted it.
    if (response.status() === 404) {
      return;
    }

    await this.validateResponse(
      response,
      `Delete article ${slug}`,
    );
  }

  async articleExists(
    slug: string,
    token?: string,
  ): Promise<boolean> {
    const response = await this.request.get(
      `${this.apiBaseUrl}/articles/${encodeURIComponent(slug)}`,
      {
        headers: token
          ? this.authHeaders(token)
          : undefined,
      },
    );

    if (response.status() === 404) {
      return false;
    }

    await this.validateResponse(
      response,
      `Check article ${slug}`,
    );

    return true;
  }

  private authHeaders(
    token: string,
  ): Record<string, string> {
    return {
      Authorization: `Token ${token}`,
    };
  }

  private async validateResponse(
    response: APIResponse,
    operation: string,
  ): Promise<void> {
    if (response.ok()) {
      return;
    }

    const responseBody = await response.text();

    throw new Error(
      [
        `${operation} failed.`,
        `HTTP status: ${response.status()}.`,
        `Response: ${responseBody}`,
      ].join(' '),
    );
  }
}