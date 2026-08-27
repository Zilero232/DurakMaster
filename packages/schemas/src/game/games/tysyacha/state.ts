import { z } from 'zod';

import { cardSchema, suitSchema } from '../../core/card';
import { gameCoreStateSchema } from '../../core/player';
import { tysyachaRulesSchema } from './rules';

export const TYSYACHA_RANK_ORDER = ['nine', 'jack', 'queen', 'king', 'ten', 'ace'] as const;

export const TYSYACHA_CARD_POINTS = {
  ace: 11,
  ten: 10,
  king: 4,
  queen: 3,
  jack: 2,
  nine: 0
} as const;

export const TYSYACHA_TRICK_POINTS_TOTAL = 120;

export const MARRIAGE_POINTS = {
  hearts: 100,
  diamonds: 80,
  clubs: 60,
  spades: 40
} as const;

export const tysyachaPhaseSchema = z.enum(['bidding', 'discarding', 'playing', 'scoring']);

export type TysyachaPhase = z.infer<typeof tysyachaPhaseSchema>;

export const tysyachaBidSchema = z.object({
  seat: z.number().int().nonnegative(),
  value: z.number().int().nullable()
});

export type TysyachaBid = z.infer<typeof tysyachaBidSchema>;

export const tysyachaTrickCardSchema = z.object({
  seat: z.number().int().nonnegative(),
  card: cardSchema
});

export type TysyachaTrickCard = z.infer<typeof tysyachaTrickCardSchema>;

export const tysyachaStateSchema = gameCoreStateSchema.extend({
  game: z.literal('tysyacha'),
  rules: tysyachaRulesSchema,

  stage: tysyachaPhaseSchema,

  hands: z.record(z.string(), z.array(cardSchema)),
  widow: z.array(cardSchema),

  bids: z.array(tysyachaBidSchema),
  contract: z.number().int().nullable(),
  declarerSeat: z.number().int().nonnegative().nullable(),

  trick: z.array(tysyachaTrickCardSchema),
  leadSeat: z.number().int().nonnegative(),
  trump: suitSchema.nullable(),

  declaredMarriages: z.array(z.object({ seat: z.number().int().nonnegative(), suit: suitSchema })),

  wonCards: z.record(z.string(), z.array(cardSchema)),

  scores: z.record(z.string(), z.number().int()),
  bolts: z.record(z.string(), z.number().int().nonnegative()),
  barrelAttempts: z.record(z.string(), z.number().int().nonnegative()),

  dealNumber: z.number().int().nonnegative(),
  dealerSeat: z.number().int().nonnegative(),

  winnerUserId: z.string().nullable()
});

export type TysyachaState = z.infer<typeof tysyachaStateSchema>;

export const tysyachaViewSchema = tysyachaStateSchema
  .omit({ hands: true, widow: true, wonCards: true })
  .extend({
    hand: z.array(cardSchema),
    widowCards: z.array(cardSchema).nullable(),
    widowCount: z.number().int().nonnegative(),
    myTrickPoints: z.number().int().nonnegative()
  });

export type TysyachaView = z.infer<typeof tysyachaViewSchema>;
