import { z } from 'zod';

import type { GameId } from './game-id';

import { burkozelRulesSchema, DEFAULT_BURKOZEL_RULES } from '../games/burkozel';
import { DEFAULT_DURAK_RULES, durakRulesSchema } from '../games/durak';
import { DEFAULT_KOZEL_RULES, kozelRulesSchema } from '../games/kozel';
import { DEFAULT_TYSYACHA_RULES, tysyachaRulesSchema } from '../games/tysyacha';
import { commonTableSettingsSchema, DEFAULT_COMMON_SETTINGS } from './table-settings-common';

export const tableSettingsSchema = z.discriminatedUnion('game', [
  commonTableSettingsSchema.extend({
    game: z.literal('durak'),
    rules: durakRulesSchema
  }),
  commonTableSettingsSchema.extend({
    game: z.literal('burkozel'),
    rules: burkozelRulesSchema
  }),
  commonTableSettingsSchema.extend({
    game: z.literal('kozel'),
    rules: kozelRulesSchema
  }),
  commonTableSettingsSchema.extend({
    game: z.literal('tysyacha'),
    rules: tysyachaRulesSchema
  })
]);

export type TableSettings = z.infer<typeof tableSettingsSchema>;

export type SettingsForGame<G extends GameId> = Extract<TableSettings, { game: G }>;

export const DEFAULT_TABLE_SETTINGS: Record<GameId, TableSettings> = {
  durak: { ...DEFAULT_COMMON_SETTINGS, game: 'durak', rules: DEFAULT_DURAK_RULES },
  burkozel: { ...DEFAULT_COMMON_SETTINGS, game: 'burkozel', rules: DEFAULT_BURKOZEL_RULES },
  kozel: {
    ...DEFAULT_COMMON_SETTINGS,
    game: 'kozel',
    maxPlayers: 4,
    rules: DEFAULT_KOZEL_RULES
  },
  tysyacha: {
    ...DEFAULT_COMMON_SETTINGS,
    game: 'tysyacha',
    maxPlayers: 3,
    rules: DEFAULT_TYSYACHA_RULES
  }
};
