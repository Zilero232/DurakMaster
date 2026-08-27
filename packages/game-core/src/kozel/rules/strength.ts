import type { Card, KozelRules } from '@durak-master/schemas';

import { KOZEL_PLAIN_RANK_ORDER, KOZEL_TRUMP_ORDER } from '@durak-master/schemas';

import { cardsEqual, rankValueIn } from '../../shared';

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
export const plainStrength = rankValueIn(KOZEL_PLAIN_RANK_ORDER);
