import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { API_URL, APP_SCHEME } from '@/shared/config';

const WEB_TOKEN_KEY = 'durak-master.session-token';

const isWeb = Platform.OS === 'web';

const readWebToken = (): string | null => {
  try {
    return globalThis.localStorage?.getItem(WEB_TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
};

const storeWebToken = (response: Response): void => {
  const token = response.headers.get('set-auth-token');

  if (!token) {
    return;
  }

  try {
    globalThis.localStorage?.setItem(WEB_TOKEN_KEY, token);
  } catch {}
};

const clearWebToken = (): void => {
  try {
    globalThis.localStorage?.removeItem(WEB_TOKEN_KEY);
  } catch {}
};

const requestWebToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/ws-token`, { credentials: 'include' });

    if (!response.ok) {
      return null;
    }

    const { token } = (await response.json()) as { token: string | null };

    if (token) {
      globalThis.localStorage?.setItem(WEB_TOKEN_KEY, token);
    }

    return token;
  } catch {
    return null;
  }
};

export const authClient = createAuthClient({
  baseURL: API_URL,

  fetchOptions: isWeb
    ? {
        auth: { type: 'Bearer', token: () => readWebToken() ?? undefined },
        onSuccess: ({ response }) => storeWebToken(response)
      }
    : undefined,

  plugins: [
    expoClient({
      scheme: APP_SCHEME,
      storagePrefix: 'durak-master',
      storage: SecureStore
    })
  ]
});

export const { signIn, signOut, signUp, useSession } = authClient;

const SESSION_COOKIE_NAME = 'better-auth.session_token';

export const getAuthToken = async (): Promise<string | null> => {
  if (isWeb) {
    return readWebToken() ?? (await requestWebToken());
  }

  const cookie = await Promise.resolve()
    .then(() => authClient.getCookie())
    .catch(() => '');

  if (typeof cookie !== 'string' || !cookie) {
    return null;
  }

  for (const part of cookie.split(';')) {
    const [name, ...rest] = part.trim().split('=');

    if (name?.endsWith(SESSION_COOKIE_NAME)) {
      return decodeURIComponent(rest.join('=')) || null;
    }
  }

  return null;
};

export const logout = async (): Promise<void> => {
  clearWebToken();
  await authClient.signOut();
};
