import { z } from 'zod';

import { cardSchema, suitSchema } from './card';
import { tableSettingsSchema } from './table-settings';

export const tablePairSchema = z.object({
  attack: cardSchema,
  defense: cardSchema.nullable()
});

export type TablePair = z.infer<typeof tablePairSchema>;

export const gamePhaseSchema = z.enum(['waiting', 'bout', 'taking', 'finished']);

export type GamePhase = z.infer<typeof gamePhaseSchema>;

export const playerStateSchema = z.object({
  userId: z.string(),
  seat: z.number().int().nonnegative(),
  handCount: z.number().int().nonnegative(),
  isOut: z.boolean(),
  isDisconnected: z.boolean()
});

export type PlayerState = z.infer<typeof playerStateSchema>;

export const gameStateSchema = z.object({
  tableId: z.string(),
  settings: tableSettingsSchema,
  phase: gamePhaseSchema,

  players: z.array(playerStateSchema),
  hands: z.record(z.string(), z.array(cardSchema)),
  talon: z.array(cardSchema),
  trump: suitSchema,
  trumpCard: cardSchema.nullable(),

  table: z.array(tablePairSchema),
  discard: z.array(cardSchema),

  attackerSeat: z.number().int().nonnegative(),
  defenderSeat: z.number().int().nonnegative(),
  activeSeat: z.number().int().nonnegative(),

  attackLimit: z.number().int().positive(),

  passedSeats: z.array(z.number().int().nonnegative()),

  shownTrumpSeats: z.array(z.number().int().nonnegative()),

  turnDeadline: z.number().int().nullable(),

  version: z.number().int().nonnegative(),

  loserUserId: z.string().nullable(),
  isDraw: z.boolean()
});

export type GameState = z.infer<typeof gameStateSchema>;

export const playerViewSchema = gameStateSchema
  .omit({ hands: true, talon: true, discard: true })
  .extend({
    hand: z.array(cardSchema),
    talonCount: z.number().int().nonnegative(),
    discardCount: z.number().int().nonnegative(),
    discardPile: z.array(cardSchema)
  });

export type PlayerView = z.infer<typeof playerViewSchema>;
