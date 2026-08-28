import type { Card, DurakState } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { removeCard } from '../../shared';
import { canThrowIn, isLegalAttackCard } from '../rules';
import { fail, nextThrowerSeat, syncHandCounts } from './shared';

export function applyAttack(
  state: DurakState,
  seat: number,
  userId: string,
  card: Card
): DurakReduceResult {
  if (!canThrowIn(seat, state)) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (state.table.length === 0 && seat !== state.attackerSeat) {
    return fail('NOT_YOUR_TURN');
  }

  const hand = state.hands[userId] ?? [];
  const rest = removeCard(hand, card);

  if (rest === null) {
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
    hands: { ...state.hands, [userId]: rest },
    table: [...state.table, { attack: card, defense: null, attackSeat: seat, defenseSeat: null }],
    passedSeats: state.isTaking ? state.passedSeats : [],
    activeSeat: state.isTaking
      ? (nextThrowerSeat(state) ?? state.attackerSeat)
      : state.defenderSeat,
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}
