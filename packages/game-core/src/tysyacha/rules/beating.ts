import type { Card, Suit, TysyachaState } from '@durak-master/schemas';

import { rankValue } from './points';

export const beats = (candidate: Card, best: Card, trump: Suit | null): boolean => {
  const candidateIsTrump = trump !== null && candidate.suit === trump;
  const bestIsTrump = trump !== null && best.suit === trump;

  if (candidateIsTrump !== bestIsTrump) {
    return candidateIsTrump;
  }

  if (candidate.suit !== best.suit) {
    return false;
  }

  return rankValue(candidate) > rankValue(best);
};

export const bestCard = (state: TysyachaState): Card | null => {
  const [first, ...rest] = state.trick;

  if (!first) {
    return null;
  }

  return rest.reduce(
    (best, entry) => (beats(entry.card, best, state.trump) ? entry.card : best),
    first.card
  );
};

export const trickWinnerSeat = (state: TysyachaState): number => {
  const [first, ...rest] = state.trick;

  if (!first) {
    return state.leadSeat;
  }

  return rest.reduce(
    (winner, entry) => (beats(entry.card, winner.card, state.trump) ? entry : winner),
    first
  ).seat;
};
