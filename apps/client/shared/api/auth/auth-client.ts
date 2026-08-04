'use client';

import { createAuthClient } from 'better-auth/react';

/**
 * Клиент авторизации.
 *
 * Токен хранится и подставляется вручную, а не только в cookie: Tauri-сборки
 * открываются с origin'а `tauri://localhost`, и браузерная cookie-сессия
 * туда не доезжает. Один и тот же код работает и в вебе, и в обёртке.
 */
const TOKEN_STORAGE_KEY = 'durak-master.auth-token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

const setAuthToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',

  fetchOptions: {
    // Cookie нужны вебу; bearer-токен — обёртке.
    credentials: 'include',

    auth: {
      type: 'Bearer',
      token: () => getAuthToken() ?? '',
    },

    onSuccess: (context) => {
      // Сервер возвращает токен сессии отдельным заголовком — сохраняем,
      // чтобы переживать перезапуск приложения.
      const token = context.response.headers.get('set-auth-token');

      if (token) {
        setAuthToken(token);
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

/** Полный выход: сессия на сервере и локальный токен. */
export const logout = async (): Promise<void> => {
  await authClient.signOut();
  setAuthToken(null);
};
