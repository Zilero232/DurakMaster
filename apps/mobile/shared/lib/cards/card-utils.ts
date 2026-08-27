import type { Rank, Suit } from '@durak-master/schemas';

export const cardKey = (card: { rank: Rank; suit: Suit }): string => `${card.rank}:${card.suit}`;
