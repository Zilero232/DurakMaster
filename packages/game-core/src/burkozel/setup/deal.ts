import type { BurkozelState, Card, PlayerState } from '@durak-master/schemas';

import { BURKOZEL_HAND_SIZE } from '@durak-master/schemas';

import { buildDeck, shuffle } from '../../shared';

export type Deal = {
  hands: Record<string, Card[]>;
  wonCards: Record<string, Card[]>;
  tricksWon: Record<string, number>;
  talon: Card[];
  trumpCard: Card | null;
  trump: BurkozelState['trump'];
};

/**
 * Cuts a fresh 36-card deck: a hand each, then the talon with the trump card
 * turned up at its bottom. Shared by the first deal and by every later one.
 */
export const deal = (players: PlayerState[], randomInt: (maxExclusive: number) => number): Deal => {
  const deck = shuffle(buildDeck(36), randomInt);

  const hands: Record<string, Card[]> = {};
  const wonCards: Record<string, Card[]> = {};
  const tricksWon: Record<string, number> = {};

  let cursor = 0;

  for (const player of players) {
    hands[player.userId] = deck.slice(cursor, cursor + BURKOZEL_HAND_SIZE);
    wonCards[player.userId] = [];
    tricksWon[player.userId] = 0;
    cursor += BURKOZEL_HAND_SIZE;
  }

  const talon = deck.slice(cursor);
  const trumpCard = talon[talon.length - 1] ?? null;

  return { hands, wonCards, tricksWon, talon, trumpCard, trump: trumpCard?.suit ?? 'spades' };
};
