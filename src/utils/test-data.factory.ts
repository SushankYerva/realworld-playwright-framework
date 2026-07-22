import { randomUUID } from 'node:crypto';

import type { NewArticle } from '../models/article.model';
import type { NewUser } from '../models/user.model';

function uniqueId(): string {
  return [
    Date.now(),
    randomUUID().replaceAll('-', '').slice(0, 8),
  ].join('');
}

export function createUniqueUser(): NewUser {
  const id = uniqueId();

  return {
    username: `pwuser${id}`,
    email: `pwuser${id}@example.com`,
    password: `Pw!${id}`,
  };
}

export function createUniqueArticle(): NewArticle {
  const id = uniqueId();

  return {
    title: `Playwright article ${id}`,
    description: `Automated test article ${id}`,
    body: `This article was created through the RealWorld API for Playwright testing. Reference: ${id}`,
    tagList: ['playwright', 'automation'],
  };
}