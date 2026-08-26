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

export const cardSchema = z.object({
  rank: rankSchema,
  suit: suitSchema
});

export type Card = z.infer<typeof cardSchema>;

export const DECK_SIZES = [24, 36, 52] as const;

export const deckSizeSchema = z.union([z.literal(24), z.literal(36), z.literal(52)]);
export type DeckSize = z.infer<typeof deckSizeSchema>;

export const LOWEST_RANK_BY_DECK_SIZE: Record<DeckSize, Rank> = {
  24: 'nine',
  36: 'six',
  52: 'two'
};
