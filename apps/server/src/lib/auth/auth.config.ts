import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';

import type { PrismaClient } from '../../../generated/prisma/client';

export const createAuth = (prisma: PrismaClient) =>
  betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:4000',

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 8
    },

    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24
    },

    trustedOrigins: [
      ...(process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? []),
      'durakmaster://'
    ].filter(Boolean),

    plugins: [bearer()]
  });

export type Auth = ReturnType<typeof createAuth>;
