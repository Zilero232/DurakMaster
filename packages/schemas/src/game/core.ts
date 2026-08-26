import { z } from 'zod';

export const gamePhaseSchema = z.enum(['waiting', 'playing', 'finished']);

export type GamePhase = z.infer<typeof gamePhaseSchema>;

export const playerStateSchema = z.object({
  userId: z.string(),
  seat: z.number().int().nonnegative(),
  handCount: z.number().int().nonnegative(),
  isOut: z.boolean(),
  isDisconnected: z.boolean()
});

export type PlayerState = z.infer<typeof playerStateSchema>;

export const gameCoreStateSchema = z.object({
  tableId: z.string(),
  players: z.array(playerStateSchema),
  activeSeat: z.number().int().nonnegative(),
  phase: gamePhaseSchema,
  turnDeadline: z.number().int().nullable(),
  version: z.number().int().nonnegative()
});

export type GameCoreState = z.infer<typeof gameCoreStateSchema>;

export const gameOutcomeSchema = z.object({
  loserUserId: z.string().nullable(),
  winnerUserId: z.string().nullable(),
  isDraw: z.boolean()
});

export type GameOutcome = z.infer<typeof gameOutcomeSchema>;
