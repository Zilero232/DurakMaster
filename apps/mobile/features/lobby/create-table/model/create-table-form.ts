import type { TableSettings } from '@durak-master/schemas';

import {
  DEFAULT_TABLE_SETTINGS,
  tableSettingsSchema,
  TURN_SECONDS_BY_SPEED
} from '@durak-master/schemas';
import { z } from 'zod';

export const createTableFormSchema = tableSettingsSchema
  .extend({
    password: z.string().max(32)
  })
  .refine((values) => !values.isPrivate || values.password.trim().length > 0, {
    path: ['password']
  });

export type CreateTableFormValues = z.infer<typeof createTableFormSchema>;

export const CREATE_TABLE_DEFAULTS: CreateTableFormValues = {
  ...DEFAULT_TABLE_SETTINGS,
  bet: 1_000,
  password: ''
};

export const toTableSettings = (values: CreateTableFormValues): TableSettings => {
  const { password: _password, ...settings } = values;

  return { ...settings, turnTimeoutSeconds: TURN_SECONDS_BY_SPEED[settings.speed] };
};
