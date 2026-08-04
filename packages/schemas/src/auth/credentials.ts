import { z } from 'zod';

/**
 * Учётные данные для входа и регистрации.
 *
 * Минимальная длина пароля совпадает с настройкой better-auth на сервере:
 * расхождение дало бы форму, которая пропускает то, что отвергнет сервер.
 */
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_NAME_LENGTH = 24;

export const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  /** Имя за столом. Пустое — сервер подставит часть адреса до собаки. */
  name: z.string().max(MAX_NAME_LENGTH).optional(),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
