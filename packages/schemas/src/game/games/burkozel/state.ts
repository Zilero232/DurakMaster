import { z } from 'zod';

import { cardSchema, suitSchema } from '../../core/card';
import { gameCoreStateSchema } from '../../core/player';
import { burkozelRulesSchema } from './rules';

export const BURKOZEL_HAND_SIZE = 4;

export const BURKOZEL_RANK_ORDER = [
  'six',
  'seven',
  'eight',
  'nine',
  'jack',
  'queen',
  'king',
  'ten',
  'ace'
] as const;

export const BURKOZEL_CARD_POINTS = {
  ace: 11,
  ten: 10,
  king: 4,
  queen: 3,
  jack: 2,
  nine: 0,
  eight: 0,
  seven: 0,
  six: 0
} as const;

export const BURKOZEL_TOTAL_POINTS = 120;

export const burkozelPlaySchema = z.object({
  seat: z.number().int().nonnegative(),
  cards: z.array(cardSchema).min(1).max(BURKOZEL_HAND_SIZE),
  isFaceUp: z.boolean()
});

export type BurkozelPlay = z.infer<typeof burkozelPlaySchema>;

export const burkozelVisiblePlaySchema = z.object({
  seat: z.number().int().nonnegative(),
  cards: z.array(cardSchema).nullable(),
  cardCount: z.number().int().positive(),
  isFaceUp: z.boolean()
});

export type BurkozelVisiblePlay = z.infer<typeof burkozelVisiblePlaySchema>;

export const burkozelStateSchema = gameCoreStateSchema.extend({
  game: z.literal('burkozel'),
  rules: burkozelRulesSchema,

  hands: z.record(z.string(), z.array(cardSchema)),
  talon: z.array(cardSchema),
  trump: suitSchema,
  trumpCard: cardSchema.nullable(),

  trick: z.array(burkozelPlaySchema),
  leadSeat: z.number().int().nonnegative(),
  bestPlayIndex: z.number().int().nonnegative().nullable(),

  wonCards: z.record(z.string(), z.array(cardSchema)),
  tricksWon: z.record(z.string(), z.number().int().nonnegative()),

  penalties: z.record(z.string(), z.number().int().nonnegative()),

  loserUserId: z.string().nullable(),
  isDraw: z.boolean()
});

export type BurkozelState = z.infer<typeof burkozelStateSchema>;

export const burkozelViewSchema = burkozelStateSchema
  .omit({ hands: true, talon: true, wonCards: true, trick: true })
  .extend({
    hand: z.array(cardSchema),
    talonCount: z.number().int().nonnegative(),
    myPoints: z.number().int().nonnegative(),
    trick: z.array(burkozelVisiblePlaySchema)
  });

export type BurkozelView = z.infer<typeof burkozelViewSchema>;
