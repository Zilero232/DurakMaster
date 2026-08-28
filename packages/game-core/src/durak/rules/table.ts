import type { Card, TablePair } from '@durak-master/schemas';

export function hasUndefendedCards(table: readonly TablePair[]): boolean {
  return table.some((pair) => pair.defense === null);
}

export function hasDefendedCards(table: readonly TablePair[]): boolean {
  return table.some((pair) => pair.defense !== null);
}

export function collectTableCards(table: readonly TablePair[]): Card[] {
  const cards: Card[] = [];

  for (const pair of table) {
    cards.push(pair.attack);

    if (pair.defense) {
      cards.push(pair.defense);
    }
  }

  return cards;
}

export function computeAttackLimit(maxAttackCards: number, defenderHandSize: number): number {
  return Math.min(maxAttackCards, defenderHandSize);
}
