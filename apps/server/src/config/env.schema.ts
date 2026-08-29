import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.url(),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url().default('http://localhost:4000'),

  PUBLIC_URL: z.url().optional(),
  CORS_ORIGINS: z.string().default('http://localhost:8081')
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (source: Record<string, unknown>): Env => envSchema.parse(source);
