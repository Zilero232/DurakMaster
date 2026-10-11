import type { Card, DurakDeckSize, Rank } from '@durak-master/schemas';

import {
  isJoker,
  JOKER_COLORS,
  LOWEST_RANK_BY_DECK_SIZE,
  RANKS,
  SUITS
} from '@durak-master/schemas';

function ranksForDeckSize(deckSize: DurakDeckSize): readonly Rank[] {
  const lowest = LOWEST_RANK_BY_DECK_SIZE[deckSize];

  return RANKS.slice(RANKS.indexOf(lowest));
}

export function buildDeck(deckSize: DurakDeckSize, withJokers = false): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of ranksForDeckSize(deckSize)) {
      deck.push({ kind: 'plain', rank, suit });
    }
  }

  if (withJokers) {
    for (const color of JOKER_COLORS) {
      deck.push({ kind: 'joker', color });
    }
  }

  return deck;
}

export function cardKey(card: Card): string {
  return isJoker(card) ? `joker:${card.color}` : `${card.rank}:${card.suit}`;
}

export function cardsEqual(a: Card, b: Card): boolean {
  return cardKey(a) === cardKey(b);
}

export function shuffle<T>(items: readonly T[], randomInt: (maxExclusive: number) => number): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const a = result[i];
    const b = result[j];

    if (a === undefined || b === undefined) {
      continue;
    }

    result[i] = b;
    result[j] = a;
  }

  return result;
}

export function handContains(hand: readonly Card[], card: Card): boolean {
  return hand.some((item) => cardsEqual(item, card));
}

export function removeCard(hand: readonly Card[], card: Card): Card[] | null {
  const index = hand.findIndex((item) => cardsEqual(item, card));

  if (index === -1) {
    return null;
  }

  return [...hand.slice(0, index), ...hand.slice(index + 1)];
}
