import type { Card, KozelRules } from '@durak-master/schemas';

import { plainStrength, trumpStrength } from './strength';
import { effectiveSuit, isTrump } from './suits';

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
