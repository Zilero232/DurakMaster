import {
  type Card,
  type DeckSize,
  LOWEST_RANK_BY_DECK_SIZE,
  RANKS,
  type Rank,
  SUITS,
  type Suit,
} from '@durak-master/schemas';

/**
 * Сила ранга — индекс в `RANKS`. Сравнивать ранги можно ТОЛЬКО так.
 */
export function rankValue(rank: Rank): number {
  return RANKS.indexOf(rank);
}

/** Ранги, входящие в колоду данного размера. */
export function ranksForDeckSize(deckSize: DeckSize): readonly Rank[] {
  const lowest = LOWEST_RANK_BY_DECK_SIZE[deckSize];

  return RANKS.slice(RANKS.indexOf(lowest));
}

/** Неперемешанная колода заданного размера. */
export function buildDeck(deckSize: DeckSize): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of ranksForDeckSize(deckSize)) {
      deck.push({ rank, suit });
    }
  }

  return deck;
}

/**
 * Бьёт ли `defense` карту `attack` при козыре `trump`.
 *
 * Правила:
 *   — та же масть и старше по рангу;
 *   — козырь бьёт любую некозырную;
 *   — козырь бьётся только старшим козырем.
 */
export function beats(defense: Card, attack: Card, trump: Suit): boolean {
  const defenseIsTrump = defense.suit === trump;
  const attackIsTrump = attack.suit === trump;

  if (defenseIsTrump && !attackIsTrump) {
    return true;
  }

  if (!defenseIsTrump && attackIsTrump) {
    return false;
  }

  // Обе козырные либо обе некозырные: масть должна совпасть.
  if (defense.suit !== attack.suit) {
    return false;
  }

  return rankValue(defense.rank) > rankValue(attack.rank);
}

export function cardsEqual(a: Card, b: Card): boolean {
  return a.rank === b.rank && a.suit === b.suit;
}

/** Стабильный ключ карты — для Map/Set и сравнения на клиенте. */
export function cardKey(card: Card): string {
  return `${card.rank}:${card.suit}`;
}

/**
 * Перемешивание Фишера–Йетса на ВНЕШНЕМ источнике случайности.
 *
 * Генератор передаётся аргументом намеренно: сам пакет не решает, откуда
 * берётся случайность. Сервер обязан передавать сюда CSPRNG
 * (`crypto.randomInt`), а тесты — детерминированный генератор.
 * `Math.random()` в продакшене недопустим: он предсказуем.
 *
 * @param randomInt функция, возвращающая целое в диапазоне [0, maxExclusive)
 */
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
