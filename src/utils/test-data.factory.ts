import { randomUUID } from 'node:crypto';
import type { NewUser } from '../models/user.model';

export function createUniqueUser(): NewUser {
  const uniqueId = [
    Date.now(),
    randomUUID().replaceAll('-', '').slice(0, 8),
  ].join('');

  return {
    username: `pwuser${uniqueId}`,
    email: `pwuser${uniqueId}@example.com`,
    password: `Pw!${uniqueId}`,
  };
}