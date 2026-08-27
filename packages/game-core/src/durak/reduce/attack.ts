import type { Card, DurakState } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { handContains, removeCard } from '../../shared';
import { canThrowIn, isLegalAttackCard } from '../rules';
import { fail, syncHandCounts } from './shared';

export function applyAttack(
  state: DurakState,
  seat: number,
  userId: string,
  card: Card
): DurakReduceResult {
  if (!canThrowIn(seat, state)) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const hand = state.hands[userId] ?? [];

  if (!handContains(hand, card)) {
    return fail('CARD_NOT_IN_HAND');
  }

  if (state.table.length >= state.attackLimit) {
    return fail('ATTACK_LIMIT_REACHED');
  }

  if (!isLegalAttackCard(card, state.table, state.attackLimit)) {
    return fail('RANK_NOT_ON_TABLE');
  }

  const next: DurakState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table: [...state.table, { attack: card, defense: null, attackSeat: seat, defenseSeat: null }],
    passedSeats: [],
    activeSeat: state.defenderSeat,
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}
