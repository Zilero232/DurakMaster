import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';

import type { PrismaClient } from '../../../generated/prisma/client';

/**
 * Конфигурация better-auth.
 *
 * Плагин `bearer` включён намеренно: WebSocket из Tauri-обёртки не имеет
 * браузерных cookie, поэтому клиент передаёт токен явно. Веб-клиент при
 * этом продолжает работать на cookie-сессии.
 */
export const createAuth = (prisma: PrismaClient) =>
  betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',

    emailAndPassword: {
      enabled: true,
      // Игру можно начать сразу: подтверждение почты нужно для восстановления
      // доступа, а не для входа за стол.
      requireEmailVerification: false,
      minPasswordLength: 8,
    },

    session: {
      // Партия может идти долго, а мобильный клиент — висеть в фоне.
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },

    // Tauri-сборки открываются с кастомных origin'ов.
    trustedOrigins: [
      ...(process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? []),
      'tauri://localhost',
      'http://tauri.localhost',
    ].filter(Boolean),

    plugins: [bearer()],
  });

export type Auth = ReturnType<typeof createAuth>;
