import { expoClient } from '@better-auth/expo/client';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

import { API_URL, APP_SCHEME } from '@/shared/config';

export const authClient = createAuthClient({
  baseURL: API_URL,

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
  const cookie = await authClient.getCookie().catch(() => '');

  if (!cookie) {
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
  await authClient.signOut();
};
