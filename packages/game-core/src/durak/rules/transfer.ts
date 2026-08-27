import type { Card, TablePair } from '@durak-master/schemas';

import { hasDefendedCards } from './table';

export function canTransfer(
  card: Card,
  table: readonly TablePair[],
  nextDefenderHandSize: number
): boolean {
  if (table.length === 0) {
    return false;
  }

  if (hasDefendedCards(table)) {
    return false;
  }

  const attackRank = table[0]?.attack.rank;

  if (attackRank === undefined || card.rank !== attackRank) {
    return false;
  }

  if (!table.every((pair) => pair.attack.rank === attackRank)) {
    return false;
  }

  return table.length + 1 <= nextDefenderHandSize;
}
