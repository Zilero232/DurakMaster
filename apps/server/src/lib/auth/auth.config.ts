import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';

import type { PrismaClient } from '../../../generated/prisma/client';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const APP_ORIGIN = 'durakmaster://';

const EXPO_DEV_ORIGINS = 'exp://**';

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

    trustedOrigins: IS_PRODUCTION ? [APP_ORIGIN] : [APP_ORIGIN, EXPO_DEV_ORIGINS],

    plugins: [bearer()]
  });

export type Auth = ReturnType<typeof createAuth>;
