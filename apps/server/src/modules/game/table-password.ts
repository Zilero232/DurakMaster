import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * Пароль приватного стола.
 *
 * Хешируется, а не хранится как есть: пароли столов люди берут из тех же,
 * что и везде, и утечка дампа памяти не должна их раскрывать.
 *
 * `scrypt` вместо быстрых хешей намеренно — он рассчитан на пароли:
 * подбор по словарю становится дорогим даже при коротких строках.
 */
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

  // Сравнение за константное время: обычное `===` подсказало бы длину
  // совпавшего префикса по времени ответа.
  return key.length === candidate.length && timingSafeEqual(key, candidate);
};
