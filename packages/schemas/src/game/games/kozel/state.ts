import { z } from 'zod';

import { cardSchema, suitSchema } from '../../core/card';
import { gameCoreStateSchema } from '../../core/player';
import { kozelRulesSchema } from './rules';

export const KOZEL_HAND_SIZE = 8;

export const KOZEL_TRICKS_PER_DEAL = 8;

export const KOZEL_TRUMP_ORDER = [
  { rank: 'seven', suit: 'clubs' },
  { rank: 'queen', suit: 'clubs' },
  { rank: 'queen', suit: 'spades' },
  { rank: 'queen', suit: 'hearts' },
  { rank: 'queen', suit: 'diamonds' },
  { rank: 'jack', suit: 'clubs' },
  { rank: 'jack', suit: 'spades' },
  { rank: 'jack', suit: 'hearts' },
  { rank: 'jack', suit: 'diamonds' },
  { rank: 'ace', suit: 'clubs' },
  { rank: 'ten', suit: 'clubs' },
  { rank: 'king', suit: 'clubs' },
  { rank: 'nine', suit: 'clubs' },
  { rank: 'eight', suit: 'clubs' }
] as const;

export const KOZEL_PLAIN_RANK_ORDER = [
  'seven',
  'eight',
  'nine',
  'jack',
  'king',
  'ten',
  'ace'
] as const;

export const KOZEL_CARD_POINTS = {
  ace: 11,
  ten: 10,
  king: 4,
  queen: 3,
  jack: 2,
  nine: 0,
  eight: 0,
  seven: 0
} as const;

export const kozelTrickCardSchema = z.object({
  seat: z.number().int().nonnegative(),
  card: cardSchema
});

export type KozelTrickCard = z.infer<typeof kozelTrickCardSchema>;

export const kozelPhaseSchema = z.enum(['waiting', 'chooseLeader', 'playing', 'finished']);

export type KozelPhase = z.infer<typeof kozelPhaseSchema>;

export const kozelStateSchema = gameCoreStateSchema.extend({
  game: z.literal('kozel'),
  rules: kozelRulesSchema,
  phase: kozelPhaseSchema,

  hands: z.record(z.string(), z.array(cardSchema)),

  trick: z.array(kozelTrickCardSchema),
  leadSeat: z.number().int().nonnegative(),
  trickNumber: z.number().int().nonnegative(),

  unledSuits: z.array(suitSchema),

  wonCards: z.record(z.string(), z.array(cardSchema)),
  tricksWon: z.record(z.string(), z.number().int().nonnegative()),

  pairs: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),

  hadEggs: z.boolean(),

  lastDealPoints: z.tuple([z.number().int(), z.number().int()]).nullable(),

  isDealComplete: z.boolean(),

  dealNumber: z.number().int().nonnegative(),
  dealerSeat: z.number().int().nonnegative(),

  loserTeam: z.union([z.literal(0), z.literal(1)]).nullable(),
  isDraw: z.boolean()
});

export type KozelState = z.infer<typeof kozelStateSchema>;

export const kozelViewSchema = kozelStateSchema.omit({ hands: true, wonCards: true }).extend({
  hand: z.array(cardSchema),
  handCounts: z.record(z.string(), z.number().int().nonnegative()),
  myTeam: z.union([z.literal(0), z.literal(1)]),
  myTeamPoints: z.number().int().nonnegative(),
  opponentPoints: z.number().int().nonnegative()
});

export type KozelView = z.infer<typeof kozelViewSchema>;
