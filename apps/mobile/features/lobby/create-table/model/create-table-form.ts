import type { DurakDeckSize, GameId, TableSettings } from '@durak-master/schemas';

import {
  burkozelRulesSchema,
  commonTableSettingsSchema,
  DEFAULT_BURKOZEL_RULES,
  DEFAULT_COMMON_SETTINGS,
  DEFAULT_DURAK_RULES,
  DEFAULT_GAME,
  DEFAULT_KOZEL_RULES,
  DEFAULT_TYSYACHA_RULES,
  durakRulesSchema,
  gameIdSchema,
  kozelRulesSchema,
  maxDurakPlayers,
  PLAYER_RANGE_BY_GAME,
  TURN_SECONDS_BY_SPEED,
  tysyachaRulesSchema
} from '@durak-master/schemas';
import { clamp } from 'remeda';
import { match } from 'ts-pattern';
import { z } from 'zod';

export const createTableFormSchema = commonTableSettingsSchema
  .extend({
    game: gameIdSchema,

    durakRules: durakRulesSchema,
    burkozelRules: burkozelRulesSchema,
    kozelRules: kozelRulesSchema,
    tysyachaRules: tysyachaRulesSchema,
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
  burkozelRules: DEFAULT_BURKOZEL_RULES,
  kozelRules: DEFAULT_KOZEL_RULES,
  tysyachaRules: DEFAULT_TYSYACHA_RULES,
  password: ''
};

export const clampPlayersToGame = (
  game: GameId,
  maxPlayers: number,
  deckSize?: DurakDeckSize
): number => {
  const { min, max: range } = PLAYER_RANGE_BY_GAME[game];

  const max = game === 'durak' && deckSize ? Math.min(range, maxDurakPlayers(deckSize)) : range;

  return clamp(maxPlayers, { min, max });
};

export const toTableSettings = (values: CreateTableFormValues): TableSettings => {
  const {
    game,
    maxPlayers,
    bet,
    isPrivate,
    speed,
    durakRules,
    burkozelRules,
    kozelRules,
    tysyachaRules
  } = values;

  const common = {
    maxPlayers: clampPlayersToGame(game, maxPlayers, durakRules.deckSize),
    bet,
    isPrivate,
    speed,
    turnTimeoutSeconds: TURN_SECONDS_BY_SPEED[speed]
  };

  return match(game)
    .with('durak', (id) => ({ ...common, game: id, rules: durakRules }))
    .with('burkozel', (id) => ({ ...common, game: id, rules: burkozelRules }))
    .with('kozel', (id) => ({ ...common, game: id, rules: kozelRules }))
    .with('tysyacha', (id) => ({ ...common, game: id, rules: tysyachaRules }))
    .exhaustive();
};
