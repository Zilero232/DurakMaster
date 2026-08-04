import {
  type Card,
  type GameState,
  MAX_ATTACK_CARDS_PER_BOUT,
  type TablePair,
} from '@durak-master/schemas';

import { beats, cardsEqual } from './deck';

/**
 * Ранги, которыми разрешено подкидывать в текущем отбое.
 *
 * ВАЖНО: считаются И атакующие карты, И карты защищающегося. Карта, которой
 * отбились, тоже открывает свой ранг для подкидывания — это правило чаще всего
 * реализуют неверно.
 */
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

/**
 * Предел атакующих карт в отбое: min(6, рука защищающегося на НАЧАЛО отбоя).
 *
 * Считается один раз при старте отбоя и дальше не пересчитывается: по мере
 * защиты рука уменьшается, и пересчёт по текущей руке ошибочно заблокировал бы
 * законные подкидывания.
 */
export function computeAttackLimit(defenderHandSize: number): number {
  return Math.min(MAX_ATTACK_CARDS_PER_BOUT, defenderHandSize);
}

/** Есть ли на столе неотбитые карты. */
export function hasUndefendedCards(table: readonly TablePair[]): boolean {
  return table.some((pair) => pair.defense === null);
}

/** Можно ли ещё подкинуть — по числу уже выложенных атакующих карт. */
export function canAddAttackCard(state: Pick<GameState, 'table' | 'attackLimit'>): boolean {
  return state.table.length < state.attackLimit;
}

/**
 * Законно ли подкинуть карту `card`.
 * Первая карта отбоя проходит всегда; последующие — только совпадением ранга.
 */
export function isLegalAttackCard(
  card: Card,
  table: readonly TablePair[],
  attackLimit: number,
): boolean {
  if (table.length >= attackLimit) {
    return false;
  }

  if (table.length === 0) {
    return true;
  }

  return allowedThrowInRanks(table).has(card.rank);
}

/** Карты руки, которыми можно отбить конкретную атакующую карту. */
export function defendingOptions(hand: readonly Card[], attack: Card, trump: GameState['trump']) {
  return hand.filter((card) => beats(card, attack, trump));
}

/**
 * Можно ли перевести атаку картой `card`.
 *
 * Условия перевода:
 *   — ни одна карта на столе ещё не отбита (после начала защиты перевод запрещён);
 *   — все карты на столе одного ранга и `card` того же ранга;
 *   — у следующего защищающегося хватит карт отбить получившуюся атаку.
 *     Иначе возникает заведомо непроходимая позиция.
 */
export function canTransfer(
  card: Card,
  table: readonly TablePair[],
  nextDefenderHandSize: number,
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

  // После перевода на столе станет table.length + 1 атакующих карт.
  return table.length + 1 <= nextDefenderHandSize;
}

/** Отбита ли хотя бы одна карта — после этого перевод невозможен. */
export function hasDefendedCards(table: readonly TablePair[]): boolean {
  return table.some((pair) => pair.defense !== null);
}

/** Есть ли карта в руке. */
export function handContains(hand: readonly Card[], card: Card): boolean {
  return hand.some((item) => cardsEqual(item, card));
}

/** Рука без первого вхождения карты. */
export function removeCard(hand: readonly Card[], card: Card): Card[] {
  const index = hand.findIndex((item) => cardsEqual(item, card));

  if (index === -1) {
    return [...hand];
  }

  return [...hand.slice(0, index), ...hand.slice(index + 1)];
}

/**
 * Вправе ли игрок подкидывать в этом отбое.
 *
 * `all`       — любой активный игрок, кроме защищающегося.
 * `neighbors` — только соседи защищающегося: основной атакующий (слева от него)
 *               и игрок справа. При двух игроках отличий от `all` нет.
 */
export function canThrowIn(
  seat: number,
  state: Pick<GameState, 'players' | 'defenderSeat' | 'attackerSeat' | 'settings'>,
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
  // Соседи защищающегося по кругу.
  const leftOfDefender = (state.defenderSeat + count - 1) % count;
  const rightOfDefender = (state.defenderSeat + 1) % count;

  return seat === leftOfDefender || seat === rightOfDefender;
}

/** Все карты со стола — забираются защищающимся при «беру». */
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
