import { z } from 'zod';

import type { GameId } from './game-id';

import { durakActionSchema } from '../games/durak';

export const gameActionSchema = z.discriminatedUnion('game', [
  z.object({ game: z.literal('durak'), action: durakActionSchema })
]);

export type GameAction = z.infer<typeof gameActionSchema>;

export type ActionForGame<G extends GameId> = Extract<GameAction, { game: G }>;

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
  'INVALID_ACTION_FOR_PHASE',
  'NOT_ENOUGH_COINS',
  'NOT_ENOUGH_CREDITS',
  'WRONG_GAME',

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

  'ALREADY_FRIENDS',
  'ALREADY_CLAIMED',
  'CANNOT_FRIEND_SELF',
  'FRIEND_LIMIT_REACHED',
  'FRIEND_OFFLINE',
  'NOT_FRIENDS',
  'NOT_UNLOCKED',
  'REQUEST_NOT_FOUND',
  'USER_NOT_FOUND',

  'BONUS_NOT_READY',
  'BOTS_DISABLED',
  'PASSWORD_REQUIRED',
  'TABLE_FULL',
  'TABLE_NOT_FOUND',
  'WRONG_PASSWORD'
]);

export type GameErrorCode = z.infer<typeof gameErrorCodeSchema>;
