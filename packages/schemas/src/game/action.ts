import { z } from 'zod';

import { cardSchema } from './card';

export const gameActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('attack'),
    card: cardSchema
  }),

  z.object({
    type: z.literal('defend'),
    pairIndex: z.number().int().nonnegative(),
    card: cardSchema
  }),

  z.object({
    type: z.literal('transfer'),
    card: cardSchema
  }),

  z.object({
    type: z.literal('transferByShowing'),
    card: cardSchema
  }),

  z.object({
    type: z.literal('take')
  }),

  z.object({
    type: z.literal('pass')
  })
]);

export type GameAction = z.infer<typeof gameActionSchema>;
export type GameActionType = GameAction['type'];

export const playerActionSchema = z.object({
  userId: z.string(),
  action: gameActionSchema,
  expectedVersion: z.number().int().nonnegative()
});

export type PlayerAction = z.infer<typeof playerActionSchema>;

export const gameErrorCodeSchema = z.enum([
  'NOT_YOUR_TURN',
  'NOT_IN_GAME',
  'GAME_NOT_ACTIVE',
  'CARD_NOT_IN_HAND',
  'VERSION_MISMATCH',
  'ATTACK_LIMIT_REACHED',
  'RANK_NOT_ON_TABLE',
  'CANNOT_BEAT_CARD',
  'PAIR_ALREADY_DEFENDED',
  'PAIR_NOT_FOUND',
  'TRANSFER_NOT_ALLOWED',
  'TRANSFER_AFTER_DEFENSE',
  'TRANSFER_RANK_MISMATCH',
  'TRANSFER_TARGET_HAS_TOO_FEW_CARDS',
  'NOTHING_TO_TAKE',
  'CANNOT_PASS_AS_DEFENDER',
  'INVALID_ACTION_FOR_PHASE',
  'NOT_ENOUGH_CREDITS'
]);

export type GameErrorCode = z.infer<typeof gameErrorCodeSchema>;
