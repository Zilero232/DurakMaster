import type { Card, Suit } from '@durak-master/schemas';

import { MIN_BID } from '@durak-master/schemas';

import { cardKey } from '@/shared/lib/cards';

import { useGameSeat } from '../use-game-seat';

export const useTysyachaGame = () => {
  const seat = useGameSeat('tysyacha');
  const { view, isMyTurn, play } = seat;

  const stage = view?.stage ?? 'bidding';

  const isDeclarer = view?.declarerSeat === seat.mySeat;

  const highestBid = (view?.bids ?? []).reduce(
    (best, entry) => Math.max(best, entry.value ?? 0),
    0
  );

  return {
    ...seat,

    stage,
    isDeclarer,
    contract: view?.contract ?? null,
    widowCards: view?.widowCards ?? null,
    myPoints: view?.myTrickPoints ?? 0,
    scores: view?.scores ?? {},
    nextBid: Math.max(highestBid + (view?.rules.bidStep ?? 5), MIN_BID),

    playableKeys: new Set(isMyTurn && stage === 'playing' ? (view?.hand ?? []).map(cardKey) : []),

    bid: (value: number) => play({ type: 'bid', value }),
    pass: () => play({ type: 'pass' }),
    discard: (cards: Card[], gifts: { seat: number; card: Card }[]) =>
      play({ type: 'discard', cards, gifts }),
    playCard: (card: Card) => play({ type: 'play', card }),
    declareMarriage: (suit: Suit, card: Card) => play({ type: 'declareMarriage', suit, card }),
    concede: () => play({ type: 'concede' })
  };
};

export type TysyachaGame = ReturnType<typeof useTysyachaGame>;
