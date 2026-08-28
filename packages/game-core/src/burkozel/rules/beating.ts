import type { BurkozelRules, Card, Suit } from '@durak-master/schemas';

import { burkozelRankValue } from './points';
import { isShokha } from './shokha';

export function beatsCard(
  attacker: Card,
  defender: Card,
  trump: Suit,
  rules: BurkozelRules
): boolean {
  if (isShokha(attacker, rules)) {
    return true;
  }

  if (isShokha(defender, rules)) {
    return false;
  }

  const attackerIsTrump = attacker.suit === trump;
  const defenderIsTrump = defender.suit === trump;

  if (attackerIsTrump && !defenderIsTrump) {
    return true;
  }

  if (!attackerIsTrump && defenderIsTrump) {
    return false;
  }

  if (attacker.suit !== defender.suit) {
    return false;
  }

  return burkozelRankValue(attacker) > burkozelRankValue(defender);
}
