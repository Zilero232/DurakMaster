import type { Card, PlayerState } from '@durak-master/schemas';

import { RANKS, SUITS } from '@durak-master/schemas';

import { shuffle } from '../../shared';
import { HAND_SIZE, WIDOW_SIZE } from '../config';

export const TYSYACHA_RANKS = ['nine', 'jack', 'queen', 'king', 'ten', 'ace'] as const;

const buildDeck = (): Card[] =>
  SUITS.flatMap((suit) =>
    RANKS.filter((rank) => TYSYACHA_RANKS.includes(rank as (typeof TYSYACHA_RANKS)[number])).map(
      (rank) => ({ suit, rank })
    )
  );

type Deal = {
  hands: Record<string, Card[]>;
  wonCards: Record<string, Card[]>;
  widow: Card[];
};

export const deal = (players: PlayerState[], randomInt: (maxExclusive: number) => number): Deal => {
  const deck = shuffle(buildDeck(), randomInt);

  const hands: Record<string, Card[]> = {};
  const wonCards: Record<string, Card[]> = {};

  let cursor = WIDOW_SIZE;

  for (const player of players) {
    hands[player.userId] = deck.slice(cursor, cursor + HAND_SIZE);
    wonCards[player.userId] = [];
    cursor += HAND_SIZE;
  }

  return { hands, wonCards, widow: deck.slice(0, WIDOW_SIZE) };
};
