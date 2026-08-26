import { z } from 'zod';

import { tableSettingsSchema } from '../game';

export const TABLE_PASSWORD_MAX_LENGTH = 32;

export const tableStatusSchema = z.enum(['waiting', 'playing', 'finished']);
export type TableStatus = z.infer<typeof tableStatusSchema>;

export const tablePlayerSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  rating: z.number().int(),
  seat: z.number().int().nonnegative(),
  isReady: z.boolean()
});

export type TablePlayer = z.infer<typeof tablePlayerSchema>;

export const lobbyTableSchema = z.object({
  id: z.string(),
  status: tableStatusSchema,
  settings: tableSettingsSchema,
  players: z.array(tablePlayerSchema),
  hasPremiumPlayer: z.boolean(),
  createdAt: z.number().int()
});

export type LobbyTable = z.infer<typeof lobbyTableSchema>;

export const createTableInputSchema = z.object({
  settings: tableSettingsSchema,
  password: z.string().min(1).max(TABLE_PASSWORD_MAX_LENGTH).optional()
});

export type CreateTableInput = z.infer<typeof createTableInputSchema>;

export const joinTableInputSchema = z.object({
  tableId: z.string(),
  password: z.string().optional()
});

export type JoinTableInput = z.infer<typeof joinTableInputSchema>;

export const lobbyFilterSchema = z.object({
  isPrivate: z.boolean().optional(),
  minBet: z.number().int().nonnegative().optional(),
  maxBet: z.number().int().nonnegative().optional(),
  playersCount: z.number().int().optional()
});

export type LobbyFilter = z.infer<typeof lobbyFilterSchema>;
