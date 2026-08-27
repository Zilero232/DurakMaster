import type { BurkozelRules, Card, Suit } from '@durak-master/schemas';

import { BURKOZEL_CARD_POINTS, BURKOZEL_RANK_ORDER } from '@durak-master/schemas';

const SHOKHA: Card = { rank: 'six', suit: 'spades' };

export function isShokha(card: Card, rules: BurkozelRules): boolean {
  return rules.shokhaEnabled && card.rank === SHOKHA.rank && card.suit === SHOKHA.suit;
}

export function burkozelRankValue(card: Card): number {
  return BURKOZEL_RANK_ORDER.indexOf(card.rank as (typeof BURKOZEL_RANK_ORDER)[number]);
}

export function cardPoints(card: Card): number {
  return BURKOZEL_CARD_POINTS[card.rank as keyof typeof BURKOZEL_CARD_POINTS] ?? 0;
}

export function setPoints(cards: readonly Card[]): number {
  return cards.reduce((sum, card) => sum + cardPoints(card), 0);
}

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

export function isLegalLead(cards: readonly Card[], rules: BurkozelRules): boolean {
  if (cards.length === 0) {
    return false;
  }

  const suits = new Set(cards.filter((card) => !isShokha(card, rules)).map((card) => card.suit));

  return suits.size <= 1;
}
