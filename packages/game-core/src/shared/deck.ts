import type { Card, DeckSize, Rank } from '@durak-master/schemas';

import { LOWEST_RANK_BY_DECK_SIZE, RANKS, SUITS } from '@durak-master/schemas';

function ranksForDeckSize(deckSize: DeckSize): readonly Rank[] {
  const lowest = LOWEST_RANK_BY_DECK_SIZE[deckSize];

  return RANKS.slice(RANKS.indexOf(lowest));
}

export function buildDeck(deckSize: DeckSize): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of ranksForDeckSize(deckSize)) {
      deck.push({ rank, suit });
    }
  }

  return deck;
}

export function cardsEqual(a: Card, b: Card): boolean {
  return a.rank === b.rank && a.suit === b.suit;
}

export function cardKey(card: Card): string {
  return `${card.rank}:${card.suit}`;
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

export function removeCard(hand: readonly Card[], card: Card): Card[] {
  const index = hand.findIndex((item) => cardsEqual(item, card));

  if (index === -1) {
    return [...hand];
  }

  return [...hand.slice(0, index), ...hand.slice(index + 1)];
}
