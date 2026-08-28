import type { Card, PlayerState } from '@durak-master/schemas';

import { KOZEL_HAND_SIZE } from '@durak-master/schemas';

import { buildDeck, cardsEqual, shuffle } from '../../shared';
import { LOWEST_TRUMP } from '../config';

type DealInput = {
  players: PlayerState[];
  dealerSeat: number;
  randomInt: (maxExclusive: number) => number;
};

type DealResult = {
  hands: Record<string, Card[]>;
  wonCards: Record<string, Card[]>;
  tricksWon: Record<string, number>;
  lowestTrumpSeat: number;
};

/**
 * Deals the whole 32-card deck out: four hands of eight, no talon and no
 * turned-up card. Trump in Kozel is fixed by the rules, not by a deal.
 */
export const dealHands = ({ players, randomInt }: DealInput): DealResult => {
  const deck = shuffle(buildDeck(32), randomInt);

  const hands: Record<string, Card[]> = {};
  const wonCards: Record<string, Card[]> = {};
  const tricksWon: Record<string, number> = {};

  let lowestTrumpSeat = 0;
  let cursor = 0;

  for (const player of players) {
    const hand = deck.slice(cursor, cursor + KOZEL_HAND_SIZE);

    hands[player.userId] = hand;
    wonCards[player.userId] = [];
    tricksWon[player.userId] = 0;
    cursor += KOZEL_HAND_SIZE;

    if (hand.some((card) => cardsEqual(card, LOWEST_TRUMP))) {
      lowestTrumpSeat = player.seat;
    }
  }

  return { hands, wonCards, tricksWon, lowestTrumpSeat };
};
