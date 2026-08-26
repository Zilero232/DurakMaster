import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_NAME_LENGTH = 24;

export const credentialsSchema = z.object({
  email: z.email({ message: 'auth.invalidEmail' }),
  password: z.string().min(MIN_PASSWORD_LENGTH, { message: 'auth.shortPassword' }),
  name: z.string().max(MAX_NAME_LENGTH, { message: 'auth.longName' }).optional()
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
