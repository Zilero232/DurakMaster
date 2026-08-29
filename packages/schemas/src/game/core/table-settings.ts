import { z } from 'zod';

import type { GameId } from './game-id';

import { DEFAULT_DURAK_RULES, durakRulesSchema, maxDurakPlayers } from '../games/durak';
import { commonTableSettingsSchema, DEFAULT_COMMON_SETTINGS } from './table-settings-common';

export const tableSettingsSchema = z.discriminatedUnion('game', [
  commonTableSettingsSchema
    .extend({
      game: z.literal('durak'),
      rules: durakRulesSchema
    })
    .refine((settings) => settings.maxPlayers <= maxDurakPlayers(settings.rules.deckSize), {
      message: 'Deck is too small to deal every player a hand',
      path: ['maxPlayers']
    })
]);

export type TableSettings = z.infer<typeof tableSettingsSchema>;

export type SettingsForGame<G extends GameId> = Extract<TableSettings, { game: G }>;

export const DEFAULT_TABLE_SETTINGS: Record<GameId, TableSettings> = {
  durak: { ...DEFAULT_COMMON_SETTINGS, game: 'durak', rules: DEFAULT_DURAK_RULES }
};
