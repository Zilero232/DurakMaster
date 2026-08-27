import type { Card, KozelRules, Suit } from '@durak-master/schemas';

import { cardsEqual } from '../../shared';
import { effectiveSuit, isTrump } from './suits';

export type LegalCardsInput = {
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
