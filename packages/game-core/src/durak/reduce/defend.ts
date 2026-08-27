import type { Card, DurakState } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { handContains, removeCard } from '../../shared';
import { beats } from '../rules';
import { fail, syncHandCounts } from './shared';

export function applyDefend(
  state: DurakState,
  seat: number,
  userId: string,
  pairIndex: number,
  card: Card
): DurakReduceResult {
  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.isTaking) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const pair = state.table[pairIndex];

  if (!pair) {
    return fail('PAIR_NOT_FOUND');
  }

  if (pair.defense !== null) {
    return fail('PAIR_ALREADY_DEFENDED');
  }

  const hand = state.hands[userId] ?? [];

  if (!handContains(hand, card)) {
    return fail('CARD_NOT_IN_HAND');
  }

  if (!beats(card, pair.attack, state.trump)) {
    return fail('CANNOT_BEAT_CARD');
  }

  const table = state.table.map((item, index) =>
    index === pairIndex ? { ...item, defense: card, defenseSeat: seat } : item
  );

  const next: DurakState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table,
    passedSeats: [],
    activeSeat: state.attackerSeat,
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}
