import type { Card, GameState, TablePair } from '@durak-master/schemas';

import { MAX_ATTACK_CARDS_PER_BOUT } from '@durak-master/schemas';

import { beats, cardsEqual } from './deck';

export function allowedThrowInRanks(table: readonly TablePair[]): Set<string> {
  const ranks = new Set<string>();

  for (const pair of table) {
    ranks.add(pair.attack.rank);

    if (pair.defense) {
      ranks.add(pair.defense.rank);
    }
  }

  return ranks;
}

export function computeAttackLimit(defenderHandSize: number): number {
  return Math.min(MAX_ATTACK_CARDS_PER_BOUT, defenderHandSize);
}

export function hasUndefendedCards(table: readonly TablePair[]): boolean {
  return table.some((pair) => pair.defense === null);
}

export function canAddAttackCard(state: Pick<GameState, 'attackLimit' | 'table'>): boolean {
  return state.table.length < state.attackLimit;
}

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

export function defendingOptions(hand: readonly Card[], attack: Card, trump: GameState['trump']) {
  return hand.filter((card) => beats(card, attack, trump));
}

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

export function hasDefendedCards(table: readonly TablePair[]): boolean {
  return table.some((pair) => pair.defense !== null);
}

export function handContains(hand: readonly Card[], card: Card): boolean {
  return hand.some((item) => cardsEqual(item, card));
}

export function removeCard(hand: readonly Card[], card: Card): Card[] {
  const index = hand.findIndex((item) => cardsEqual(item, card));

  if (index === -1) {
    return [...hand];
  }

  return [...hand.slice(0, index), ...hand.slice(index + 1)];
}

export function canThrowIn(
  seat: number,
  state: Pick<GameState, 'attackerSeat' | 'defenderSeat' | 'players' | 'settings'>
): boolean {
  if (seat === state.defenderSeat) {
    return false;
  }

  const player = state.players.find((item) => item.seat === seat);

  if (!player || player.isOut) {
    return false;
  }

  if (state.settings.throwInScope === 'all') {
    return true;
  }

  const count = state.players.length;
  const leftOfDefender = (state.defenderSeat + count - 1) % count;
  const rightOfDefender = (state.defenderSeat + 1) % count;

  return seat === leftOfDefender || seat === rightOfDefender;
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
