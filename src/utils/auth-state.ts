import path from 'node:path';
import { readFile } from 'node:fs/promises';

interface LocalStorageEntry {
  name: string;
  value: string;
}

interface StorageOrigin {
  origin: string;
  localStorage: LocalStorageEntry[];
}

interface StorageState {
  origins?: StorageOrigin[];
}

const defaultAuthFile = path.join(
  process.cwd(),
  'playwright',
  '.auth',
  'user.json',
);

export async function readJwtToken(
  authFile = defaultAuthFile,
): Promise<string> {
  const fileContent = await readFile(authFile, 'utf-8');

  const storageState =
    JSON.parse(fileContent) as StorageState;

  const tokenEntry = storageState.origins
    ?.flatMap((origin) => origin.localStorage)
    .find((entry) => entry.name === 'jwtToken');

  if (!tokenEntry?.value) {
    throw new Error(
      `JWT token was not found in ${authFile}. Run the authentication setup first.`,
    );
  }

  return tokenEntry.value;
}