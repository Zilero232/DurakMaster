import type { BurkozelRules, Card, Suit } from '@durak-master/schemas';

import { beatsCard } from './beating';

/**
 * Whether a whole play beats the one currently winning the trick. A play of n
 * cards beats another only if every one of its cards can be paired off against
 * a distinct card of the other play that it beats — a perfect matching.
 *
 * Greedy pairing is wrong here: taking the first card a challenger beats can
 * strand a later challenger card that had only that one target left. So this
 * assigns targets by backtracking, undoing a pairing whenever the rest of the
 * play cannot be matched around it.
 */
export function setBeatsSet(
  challenger: readonly Card[],
  best: readonly Card[],
  trump: Suit,
  rules: BurkozelRules
): boolean {
  if (challenger.length !== best.length) {
    return false;
  }

  const used: boolean[] = challenger.map(() => false);

  const assign = (index: number): boolean => {
    if (index === challenger.length) {
      return true;
    }

    const attacker = challenger[index];

    if (!attacker) {
      return false;
    }

    for (let target = 0; target < best.length; target++) {
      const defender = best[target];

      if (used[target] || !defender || !beatsCard(attacker, defender, trump, rules)) {
        continue;
      }

      used[target] = true;

      if (assign(index + 1)) {
        return true;
      }

      used[target] = false;
    }

    return false;
  };

  return assign(0);
}
