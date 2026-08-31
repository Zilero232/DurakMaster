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

export const cardSchema = z.object({
  rank: rankSchema,
  suit: suitSchema,

  /** Set only on a joker, which has no rank or suit of its own — see docs/games/durak.md §9. */
  joker: jokerColorSchema.optional()
});

export type Card = z.infer<typeof cardSchema>;

export function isJoker(card: Card): card is Card & { joker: JokerColor } {
  return card.joker !== undefined;
}

export const DECK_SIZES = [24, 32, 36, 52] as const;

export const deckSizeSchema = z.union([z.literal(24), z.literal(32), z.literal(36), z.literal(52)]);
export type DeckSize = z.infer<typeof deckSizeSchema>;

export const LOWEST_RANK_BY_DECK_SIZE: Record<DeckSize, Rank> = {
  24: 'nine',
  32: 'seven',
  36: 'six',
  52: 'two'
};
