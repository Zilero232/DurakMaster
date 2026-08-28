import type { Card, TysyachaState } from '@durak-master/schemas';

import type { TysyachaReduceResult } from './shared';

import { cardKey, nextSeat, removeCard } from '../../shared';
import { legalPlays, marriageSuits } from '../rules';
import { finishTrick } from './finish-trick';
import { fail } from './shared';

export function applyMarriage(
  state: TysyachaState,
  seat: number,
  userId: string,
  suit: TysyachaState['trump'],
  card: Card
): TysyachaReduceResult {
  if (state.stage !== 'playing' || state.trick.length > 0) {
    return fail('MARRIAGE_REQUIRES_LEAD');
  }

  const hand = state.hands[userId] ?? [];

  if (suit === null || !marriageSuits(hand).includes(suit)) {
    return fail('MARRIAGE_NOT_HELD');
  }

  if (card.suit !== suit || (card.rank !== 'king' && card.rank !== 'queen')) {
    return fail('MARRIAGE_NOT_HELD');
  }

  const wonAnyTrick = (state.wonCards[userId] ?? []).length > 0;

  if (!state.rules.marriageOnFirstTrick && !wonAnyTrick) {
    return fail('MARRIAGE_REQUIRES_LEAD');
  }

  const played = playCard(state, seat, userId, card, suit);

  if (!played.ok) {
    return played;
  }

  return {
    ok: true,
    state: {
      ...played.state,
      declaredMarriages: [...state.declaredMarriages, { seat, suit }]
    }
  };
}

export function applyPlay(
  state: TysyachaState,
  seat: number,
  userId: string,
  card: Card
): TysyachaReduceResult {
  if (state.stage !== 'playing') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  return playCard(state, seat, userId, card, state.trump);
}

function playCard(
  state: TysyachaState,
  seat: number,
  userId: string,
  card: Card,
  trump: TysyachaState['trump']
): TysyachaReduceResult {
  const hand = state.hands[userId] ?? [];
  const rest = removeCard(hand, card);

  if (rest === null) {
    return fail('CARD_NOT_IN_HAND');
  }

  if (!legalPlays(hand, state).some((option) => cardKey(option) === cardKey(card))) {
    return fail('MUST_FOLLOW_SUIT');
  }

  const trick = [...state.trick, { seat, card }];
  const hands = { ...state.hands, [userId]: rest };

  if (trick.length < state.players.length) {
    return {
      ok: true,
      state: {
        ...state,
        hands,
        trick,
        trump,
        activeSeat: nextSeat(state.players, seat),
        version: state.version + 1
      }
    };
  }

  return finishTrick({ ...state, hands, trick, trump });
}
