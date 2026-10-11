import type { Card, GameErrorCode, TablePair } from '@durak-master/schemas';

import { isJoker } from '@durak-master/schemas';

import { hasDefendedCards } from './table';

export function findTransferError(
  card: Card,
  table: readonly TablePair[],
  nextDefenderHandSize: number
): GameErrorCode | null {
  if (table.length === 0) {
    return 'INVALID_ACTION_FOR_PHASE';
  }

  if (hasDefendedCards(table)) {
    return 'TRANSFER_AFTER_DEFENSE';
  }

  if (isJoker(card) || table.some((pair) => isJoker(pair.attack))) {
    return 'TRANSFER_NOT_ALLOWED';
  }

  if (!table.every((pair) => !isJoker(pair.attack) && pair.attack.rank === card.rank)) {
    return 'TRANSFER_RANK_MISMATCH';
  }

  if (table.length + 1 > nextDefenderHandSize) {
    return 'TRANSFER_TARGET_HAS_TOO_FEW_CARDS';
  }

  return null;
}

export function canTransfer(
  card: Card,
  table: readonly TablePair[],
  nextDefenderHandSize: number
): boolean {
  return findTransferError(card, table, nextDefenderHandSize) === null;
}
