import type { DurakDeckSize, GameId, TableSettings } from '@durak-master/schemas';

import {
  commonTableSettingsSchema,
  DEFAULT_COMMON_SETTINGS,
  DEFAULT_DURAK_RULES,
  DEFAULT_GAME,
  durakRulesSchema,
  gameIdSchema,
  maxDurakPlayers,
  PLAYER_RANGE_BY_GAME,
  TURN_SECONDS_BY_SPEED
} from '@durak-master/schemas';
import { clamp } from 'remeda';
import { z } from 'zod';

export const createTableFormSchema = commonTableSettingsSchema
  .extend({
    game: gameIdSchema,

    durakRules: durakRulesSchema,
    password: z.string().max(32)
  })
  .refine((values) => !values.isPrivate || values.password.trim().length > 0, {
    path: ['password']
  });

export type CreateTableFormValues = z.infer<typeof createTableFormSchema>;

export const CREATE_TABLE_DEFAULTS: CreateTableFormValues = {
  ...DEFAULT_COMMON_SETTINGS,
  game: DEFAULT_GAME,
  bet: 1_000,
  durakRules: DEFAULT_DURAK_RULES,
  password: ''
};

export const clampPlayersToGame = (
  game: GameId,
  maxPlayers: number,
  deckSize?: DurakDeckSize
): number => {
  const { min, max: range } = PLAYER_RANGE_BY_GAME[game];

  const max = deckSize ? Math.min(range, maxDurakPlayers(deckSize)) : range;

  return clamp(maxPlayers, { min, max });
};

export const toTableSettings = (values: CreateTableFormValues): TableSettings => {
  const { game, maxPlayers, bet, isPrivate, speed, durakRules } = values;

  return {
    game,
    rules: durakRules,
    maxPlayers: clampPlayersToGame(game, maxPlayers, durakRules.deckSize),
    bet,
    isPrivate,
    speed,
    turnTimeoutSeconds: TURN_SECONDS_BY_SPEED[speed]
  };
};
