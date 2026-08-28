import type { Card, TablePair } from '@durak-master/schemas';

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

  return allowedThrowInRanks(table).has(card.rank);
}
