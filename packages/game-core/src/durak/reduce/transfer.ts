import type { Card, DurakState } from '@durak-master/schemas';

import { isJoker } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { handContains, removeCard } from '../../shared';
import { canTransfer, computeAttackLimit, hasDefendedCards } from '../rules';
import { nextActiveSeat } from '../setup';
import { fail, handSizeAtSeat, syncHandCounts } from './shared';

export function applyTransfer(
  state: DurakState,
  seat: number,
  userId: string,
  card: Card
): DurakReduceResult {
  if (state.rules.mode !== 'transfer') {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (hasDefendedCards(state.table)) {
    return fail('TRANSFER_AFTER_DEFENSE');
  }

  const hand = state.hands[userId] ?? [];
  const rest = removeCard(hand, card);

  if (rest === null) {
    return fail('CARD_NOT_IN_HAND');
  }

  const nextDefenderSeat = nextActiveSeat(state.players, state.defenderSeat);
  const nextDefenderHandSize = handSizeAtSeat(state, nextDefenderSeat);

  if (!canTransfer(card, state.table, nextDefenderHandSize)) {
    const tableRank = state.table[0]?.attack.rank;

    if (tableRank !== undefined && card.rank !== tableRank) {
      return fail('TRANSFER_RANK_MISMATCH');
    }

    return fail('TRANSFER_TARGET_HAS_TOO_FEW_CARDS');
  }

  const table = [
    ...state.table,
    { attack: card, defense: null, attackSeat: seat, defenseSeat: null }
  ];

  const next: DurakState = {
    ...state,
    hands: { ...state.hands, [userId]: rest },
    table,
    attackerSeat: state.defenderSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextDefenderSeat,
    attackLimit: computeAttackLimit(state.rules.attackLimit, nextDefenderHandSize),
    passedSeats: [],
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}

export function applyTransferByShowing(
  state: DurakState,
  seat: number,
  userId: string,
  card: Card
): DurakReduceResult {
  if (state.rules.mode !== 'transfer' || !state.rules.allowTransferByShowingTrump) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.isTaking) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (hasDefendedCards(state.table)) {
    return fail('TRANSFER_AFTER_DEFENSE');
  }

  if (state.shownTrumpSeats.includes(seat)) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (isJoker(card) || state.table.some((pair) => isJoker(pair.attack))) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (card.suit !== state.trump) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  const hand = state.hands[userId] ?? [];

  if (!handContains(hand, card)) {
    return fail('CARD_NOT_IN_HAND');
  }

  const tableRank = state.table[0]?.attack.rank;

  if (tableRank === undefined) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (card.rank !== tableRank || !state.table.every((pair) => pair.attack.rank === tableRank)) {
    return fail('TRANSFER_RANK_MISMATCH');
  }

  const nextDefenderSeat = nextActiveSeat(state.players, state.defenderSeat);
  const nextDefenderHandSize = handSizeAtSeat(state, nextDefenderSeat);

  if (state.table.length > nextDefenderHandSize) {
    return fail('TRANSFER_TARGET_HAS_TOO_FEW_CARDS');
  }

  const next: DurakState = {
    ...state,
    attackerSeat: state.defenderSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextDefenderSeat,
    attackLimit: computeAttackLimit(state.rules.attackLimit, nextDefenderHandSize),
    passedSeats: [],
    shownTrumpSeats: [...state.shownTrumpSeats, seat],
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}
