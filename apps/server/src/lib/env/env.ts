export const isDevelopment = process.env.NODE_ENV !== 'production';

export const PUBLIC_URL =
  process.env.PUBLIC_URL ?? process.env.BETTER_AUTH_URL ?? 'http://localhost:4000';
