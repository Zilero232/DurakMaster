import type { Card, Suit } from '@durak-master/schemas';

import { RANKS } from '@durak-master/schemas';

import type { HandSort } from '@/shared/model/preferences';

const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,
  hearts: 1,
  diamonds: 2,
  clubs: 3
};

const byRank = (a: Card, b: Card): number => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);

const bySuitThenRank = (a: Card, b: Card): number =>
  a.suit === b.suit ? byRank(a, b) : SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];

const trumpLast =
  (trump: Suit) =>
  (a: Card, b: Card): number => {
    const aTrump = a.suit === trump;
    const bTrump = b.suit === trump;

    if (aTrump !== bTrump) {
      return aTrump ? 1 : -1;
    }

    return bySuitThenRank(a, b);
  };

export const sortHand = (cards: Card[], trump: Suit, mode: HandSort = 'trumpFirst'): Card[] => {
  switch (mode) {
    case 'manual': {
      return cards;
    }

    case 'rank': {
      return [...cards].sort(byRank);
    }

    case 'suit': {
      return [...cards].sort(bySuitThenRank);
    }

    default: {
      return [...cards].sort(trumpLast(trump));
    }
  }
};
