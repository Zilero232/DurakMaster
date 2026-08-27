import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 32;

export const hashTablePassword = (password: string): string => {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, KEY_LENGTH);

  return `${salt.toString('hex')}:${key.toString('hex')}`;
};

export const verifyTablePassword = (password: string, hash: string): boolean => {
  const [saltHex, keyHex] = hash.split(':');

  if (!saltHex || !keyHex) {
    return false;
  }

  const key = Buffer.from(keyHex, 'hex');
  const candidate = scryptSync(password, Buffer.from(saltHex, 'hex'), KEY_LENGTH);

  return key.length === candidate.length && timingSafeEqual(key, candidate);
};
