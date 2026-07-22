import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

import type {
  NewUser,
  RegisteredUser,
  UserResponse,
} from '../models/user.model';

export class RealWorldApiClient {
  private readonly apiBaseUrl: string;

  constructor(
    private readonly request: APIRequestContext,
    apiBaseUrl = process.env.API_URL ??
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
        headers: {
          Authorization: `Token ${token}`,
        },
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
        `HTTP status: ${response.status()}`,
        `Response: ${responseBody}`,
      ].join(' '),
    );
  }
}