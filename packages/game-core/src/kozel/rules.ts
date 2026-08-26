import type { Card, KozelRules, Suit } from '@durak-master/schemas';

import {
  KOZEL_CARD_POINTS,
  KOZEL_PLAIN_RANK_ORDER,
  KOZEL_TRUMP_ORDER
} from '@durak-master/schemas';

import { cardsEqual } from '../shared';

/**
 * The suit a card plays as. Queens, jacks and every club belong to the trump
 * group, not to the suit painted on them: the queen of diamonds is a trump and
 * does not answer a diamond lead, and a hand whose only "diamond" is that queen
 * holds no diamonds at all.
 *
 * Reading `card.suit` directly in a follow-suit check is the single most common
 * bug in implementations of this game.
 */
export const effectiveSuit = (card: Card): 'trump' | Suit =>
  card.rank === 'queen' || card.rank === 'jack' || card.suit === 'clubs' ? 'trump' : card.suit;

export const isTrump = (card: Card): boolean => effectiveSuit(card) === 'trump';

/**
 * Strength of a trump, 0 being the strongest. With `shamokIsHighest` off the
 * seven of clubs drops below every other trump — that is plain Schafkopf.
 */
export const trumpStrength = (card: Card, rules: KozelRules): number => {
  const index = KOZEL_TRUMP_ORDER.findIndex((entry) => cardsEqual(entry, card));

  if (index < 0) {
    return Number.POSITIVE_INFINITY;
  }

  if (rules.shamokIsHighest) {
    return index;
  }

  // The shamok is the first entry of the order; without it the seven of clubs
  // sits one step below the weakest trump instead.
  return index === 0 ? KOZEL_TRUMP_ORDER.length : index - 1;
};

/** Strength of a plain card, higher is stronger. Ace-ten order: the ten beats the king. */
export const plainStrength = (card: Card): number =>
  KOZEL_PLAIN_RANK_ORDER.indexOf(card.rank as (typeof KOZEL_PLAIN_RANK_ORDER)[number]);

/**
 * Value of a card in the pot. Unrelated to strength: the shamok is the strongest
 * card in the game and is worth 0. Ranks below the seven never enter a 32-card
 * deck, so they score nothing.
 */
export const cardPoints = (card: Card): number =>
  KOZEL_CARD_POINTS[card.rank as keyof typeof KOZEL_CARD_POINTS] ?? 0;

export const handPoints = (cards: readonly Card[]): number =>
  cards.reduce((total, card) => total + cardPoints(card), 0);

/**
 * Which of the played cards takes the trick: the strongest trump, or — with no
 * trump in it — the strongest card of the led suit. A discard of a foreign suit
 * never wins, however high it looks.
 */
export const trickWinnerIndex = (cards: readonly Card[], rules: KozelRules): number => {
  const [lead] = cards;

  if (!lead) {
    return 0;
  }

  const led = effectiveSuit(lead);

  let bestIndex = 0;
  let bestIsTrump = isTrump(lead);
  let bestScore = bestIsTrump ? trumpStrength(lead, rules) : plainStrength(lead);

  for (let index = 1; index < cards.length; index++) {
    const card = cards[index];

    if (!card) {
      continue;
    }

    const cardIsTrump = isTrump(card);

    if (cardIsTrump) {
      const score = trumpStrength(card, rules);

      // A trump always outranks a plain card; between trumps the lower index wins.
      if (!bestIsTrump || score < bestScore) {
        bestIndex = index;
        bestIsTrump = true;
        bestScore = score;
      }

      continue;
    }

    if (bestIsTrump || effectiveSuit(card) !== led) {
      continue;
    }

    const score = plainStrength(card);

    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  }

  return bestIndex;
};

type LegalCardsInput = {
  hand: readonly Card[];
  trick: readonly Card[];
  rules: KozelRules;
  /** The first trick of a deal bans opening on a trump while a plain card is held. */
  isFirstTrick: boolean;
  /** Plain suits nobody has led yet — used by the optional ace-discard restriction. */
  unledSuits: ReadonlySet<Suit>;
};

/**
 * The cards a player may legally put down. Kozel has exactly one obligation —
 * follow the led suit if you can. Beating is never required, and neither is
 * trumping when out of the suit.
 */
export const legalCards = ({
  hand,
  trick,
  rules,
  isFirstTrick,
  unledSuits
}: LegalCardsInput): Card[] => {
  const [lead] = trick;

  if (!lead) {
    if (!isFirstTrick) {
      return [...hand];
    }

    const plain = hand.filter((card) => !isTrump(card));

    // Opening a deal on a trump is allowed only to a hand made entirely of trumps.
    return plain.length > 0 ? plain : [...hand];
  }

  const led = effectiveSuit(lead);
  const followers = hand.filter((card) => effectiveSuit(card) === led);

  if (followers.length > 0) {
    return followers;
  }

  if (!rules.aceDiscardRestriction) {
    return [...hand];
  }

  // Off by default: while a plain suit has not been led, its ace may not be discarded.
  const allowed = hand.filter(
    (card) => !(card.rank === 'ace' && !isTrump(card) && unledSuits.has(card.suit))
  );

  return allowed.length > 0 ? allowed : [...hand];
};

export const isLegalCard = (card: Card, input: LegalCardsInput): boolean =>
  legalCards(input).some((legal) => cardsEqual(legal, card));
