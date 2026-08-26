import type { Card, Suit } from '@durak-master/schemas';

import { RANKS } from '@durak-master/schemas';

const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,
  hearts: 1,
  diamonds: 2,
  clubs: 3
};

const createComparator =
  (trump: Suit) =>
  (a: Card, b: Card): number => {
    const aTrump = a.suit === trump;
    const bTrump = b.suit === trump;

    if (aTrump !== bTrump) {
      return aTrump ? 1 : -1;
    }

    if (a.suit !== b.suit) {
      return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
    }

    return RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
  };

export const sortHand = (cards: Card[], trump: Suit): Card[] =>
  [...cards].sort(createComparator(trump));
