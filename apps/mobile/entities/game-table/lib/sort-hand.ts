import type { Card, Suit } from '@durak-master/schemas';

import { isJoker, RANKS } from '@durak-master/schemas';

import type { HandSort } from '@/shared/model/preferences';

const SUIT_ORDER: Record<Suit, number> = {
  spades: 0,
  hearts: 1,
  diamonds: 2,
  clubs: 3
};

const RANK_ORDER: Record<string, number> = Object.fromEntries(
  RANKS.map((rank, index) => [rank, index])
);

const jokersLast =
  (compare: (a: Card, b: Card) => number) =>
  (a: Card, b: Card): number => {
    const aJoker = isJoker(a);
    const bJoker = isJoker(b);

    if (aJoker !== bJoker) {
      return aJoker ? 1 : -1;
    }

    if (aJoker) {
      return 0;
    }

    return compare(a, b);
  };

const compareRank = (a: Card, b: Card): number =>
  (RANK_ORDER[a.rank] ?? 0) - (RANK_ORDER[b.rank] ?? 0);

const byRank = jokersLast(compareRank);

const bySuitThenRank = jokersLast((a, b) =>
  a.suit === b.suit ? compareRank(a, b) : SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit]
);

const trumpLast =
  (isTrump: (card: Card) => boolean) =>
  (a: Card, b: Card): number => {
    const aTrump = isTrump(a);
    const bTrump = isTrump(b);

    if (aTrump !== bTrump) {
      return aTrump ? 1 : -1;
    }

    return bySuitThenRank(a, b);
  };

export type TrumpTest = ((card: Card) => boolean) | Suit | null;

const toPredicate = (trump: TrumpTest): ((card: Card) => boolean) => {
  if (trump === null) {
    return () => false;
  }

  return typeof trump === 'function' ? trump : (card) => !isJoker(card) && card.suit === trump;
};

export const sortHand = (
  cards: Card[],
  trump: TrumpTest,
  mode: HandSort = 'trumpFirst'
): Card[] => {
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
      return [...cards].sort(trumpLast(toPredicate(trump)));
    }
  }
};
