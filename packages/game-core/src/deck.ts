import type { Card, DeckSize, Rank, Suit } from '@durak-master/schemas';

import { LOWEST_RANK_BY_DECK_SIZE, RANKS, SUITS } from '@durak-master/schemas';

export function rankValue(rank: Rank): number {
  return RANKS.indexOf(rank);
}

export function ranksForDeckSize(deckSize: DeckSize): readonly Rank[] {
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

export function beats(defense: Card, attack: Card, trump: Suit): boolean {
  const defenseIsTrump = defense.suit === trump;
  const attackIsTrump = attack.suit === trump;

  if (defenseIsTrump && !attackIsTrump) {
    return true;
  }

  if (!defenseIsTrump && attackIsTrump) {
    return false;
  }

  if (defense.suit !== attack.suit) {
    return false;
  }

  return rankValue(defense.rank) > rankValue(attack.rank);
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
