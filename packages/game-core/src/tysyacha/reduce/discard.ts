import type { Card, TysyachaState } from '@durak-master/schemas';

import type { TysyachaReduceResult } from './shared';

import { cardKey, handContains, removeCard, userIdAtSeat } from '../../shared';
import { HAND_SIZE, WIDOW_SIZE } from '../config';
import { fail } from './shared';

export function applyDiscard(
  state: TysyachaState,
  seat: number,
  userId: string,
  cards: Card[],
  gifts: { seat: number; card: Card }[]
): TysyachaReduceResult {
  if (state.stage !== 'discarding' || seat !== state.declarerSeat) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const hand = state.hands[userId] ?? [];

  if (!cards.every((card) => handContains(hand, card))) {
    return fail('CARD_NOT_IN_HAND');
  }

  if (gifts.length !== state.players.length - 1 || cards.length !== gifts.length) {
    return fail('CARD_COUNT_MISMATCH');
  }

  if (new Set(cards.map(cardKey)).size !== cards.length) {
    return fail('CARD_NOT_IN_HAND');
  }

  const hands = { ...state.hands };

  hands[userId] = cards.reduce((rest, card) => removeCard(rest, card), hand);

  for (const gift of gifts) {
    const target = userIdAtSeat(state.players, gift.seat);

    if (!target || !cards.some((card) => cardKey(card) === cardKey(gift.card))) {
      return fail('CARD_NOT_IN_HAND');
    }

    hands[target] = [...(hands[target] ?? []), gift.card];
  }

  if (hands[userId]?.length !== HAND_SIZE + WIDOW_SIZE - gifts.length) {
    return fail('CARD_COUNT_MISMATCH');
  }

  return {
    ok: true,
    state: {
      ...state,
      hands,
      players: state.players.map((player) => ({
        ...player,
        handCount: (hands[player.userId] ?? []).length
      })),
      stage: 'playing',
      leadSeat: seat,
      activeSeat: seat,
      version: state.version + 1
    }
  };
}
