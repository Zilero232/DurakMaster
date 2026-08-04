import { z } from 'zod';

/**
 * Масти. Порядок фиксирован — индекс используется при кодировании карты в число.
 */
export const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'] as const;

export const suitSchema = z.enum(SUITS);
export type Suit = z.infer<typeof suitSchema>;

/**
 * Ранги от младшего к старшему. Индекс в массиве — это сила карты:
 * сравнивать ранги можно только через этот порядок, никогда не по значению строки.
 *
 * Колоды 24/36/52 — это срезы этого массива снизу (см. `DECK_SIZES`).
 */
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
  'ace',
] as const;

export const rankSchema = z.enum(RANKS);
export type Rank = z.infer<typeof rankSchema>;

export const cardSchema = z.object({
  rank: rankSchema,
  suit: suitSchema,
});

export type Card = z.infer<typeof cardSchema>;

/**
 * Поддерживаемые размеры колоды. Каждый — это N старших рангов:
 *   24 → 9..A, 36 → 6..A, 52 → 2..A
 */
export const DECK_SIZES = [24, 36, 52] as const;

export const deckSizeSchema = z.union([z.literal(24), z.literal(36), z.literal(52)]);
export type DeckSize = z.infer<typeof deckSizeSchema>;

/** Младший ранг, входящий в колоду данного размера. */
export const LOWEST_RANK_BY_DECK_SIZE: Record<DeckSize, Rank> = {
  24: 'nine',
  36: 'six',
  52: 'two',
};
