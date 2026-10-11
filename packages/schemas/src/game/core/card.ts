import { z } from 'zod';

export const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'] as const;

export const suitSchema = z.enum(SUITS);
export type Suit = z.infer<typeof suitSchema>;

export const RANKS = [
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'jack',
  'queen',
  'king',
  'ace'
] as const;

export const rankSchema = z.enum(RANKS);
export type Rank = z.infer<typeof rankSchema>;

export const JOKER_COLORS = ['red', 'black'] as const;

export const jokerColorSchema = z.enum(JOKER_COLORS);
export type JokerColor = z.infer<typeof jokerColorSchema>;

export const plainCardSchema = z.object({
  kind: z.literal('plain'),
  rank: rankSchema,
  suit: suitSchema
});

export type PlainCard = z.infer<typeof plainCardSchema>;

export const jokerCardSchema = z.object({
  kind: z.literal('joker'),
  color: jokerColorSchema
});

export type JokerCard = z.infer<typeof jokerCardSchema>;

export const cardSchema = z.discriminatedUnion('kind', [plainCardSchema, jokerCardSchema]);

export type Card = z.infer<typeof cardSchema>;

export function isJoker(card: Card): card is JokerCard {
  return card.kind === 'joker';
}
