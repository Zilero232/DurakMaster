import type { Card, TablePair } from '@durak-master/schemas';

import { isJoker } from '@durak-master/schemas';

import { allowedThrowInRanks } from './throw-in';

export function isLegalAttackCard(
  card: Card,
  table: readonly TablePair[],
  attackLimit: number
): boolean {
  if (table.length >= attackLimit) {
    return false;
  }

  if (table.length === 0) {
    return true;
  }

  if (isJoker(card)) {
    return false;
  }

  return allowedThrowInRanks(table).has(card.rank);
}
