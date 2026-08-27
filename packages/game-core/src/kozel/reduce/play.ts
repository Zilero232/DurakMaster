import type { Card, KozelState } from '@durak-master/schemas';

import type { KozelReduceResult } from './shared';

import { cardsEqual, seatOf, withHandCounts } from '../../shared';
import { KOZEL_SEATS } from '../config';
import { effectiveSuit, isTrump, legalCards } from '../rules';
import { closeTrick } from './close-trick';
import { fail, removeCard } from './shared';

export const playCard = (state: KozelState, userId: string, card: Card): KozelReduceResult => {
  const seat = seatOf(state.players, userId);

  if (seat === null) {
    return fail('NOT_IN_GAME');
  }

  if (state.phase !== 'playing') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (state.activeSeat !== seat) {
    return fail('NOT_YOUR_TURN');
  }

  const hand = state.hands[userId] ?? [];
  const rest = removeCard(hand, card);

  if (!rest) {
    return fail('CARD_NOT_IN_HAND');
  }

  const trickCards = state.trick.map((entry) => entry.card);
  const allowed = legalCards({
    hand,
    trick: trickCards,
    rules: state.rules,
    isFirstTrick: state.trickNumber === 0,
    unledSuits: new Set(state.unledSuits)
  });

  if (!allowed.some((legal) => cardsEqual(legal, card))) {
    // Leading a trump into the opening trick is its own mistake; everything else
    // that reaches here is a failure to follow the led suit.
    return fail(state.trick.length === 0 ? 'MUST_LEAD_PLAIN_SUIT' : 'MUST_FOLLOW_SUIT');
  }

  const hands = { ...state.hands, [userId]: rest };
  const trick = [...state.trick, { seat, card }];

  // A plain lead marks its suit as seen — the ace-discard restriction reads this.
  const unledSuits =
    state.trick.length === 0 && !isTrump(card)
      ? state.unledSuits.filter((suit) => suit !== effectiveSuit(card))
      : state.unledSuits;

  const played: KozelState = { ...state, hands, trick, unledSuits };

  if (trick.length === KOZEL_SEATS) {
    return { ok: true, state: closeTrick(played, hands) };
  }

  return {
    ok: true,
    state: {
      ...played,
      activeSeat: (seat + 1) % KOZEL_SEATS,
      players: withHandCounts(played.players, hands),
      version: state.version + 1
    }
  };
};
