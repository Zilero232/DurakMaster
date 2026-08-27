import type { BurkozelRules, Card } from '@durak-master/schemas';

import { SHOKHA } from '../config';

export function isShokha(card: Card, rules: BurkozelRules): boolean {
  return rules.shokhaEnabled && card.rank === SHOKHA.rank && card.suit === SHOKHA.suit;
}

/**
 * A lead has to be of one suit, which the shokha is exempt from: it belongs to
 * no suit and may join any lead.
 */
export function isLegalLead(cards: readonly Card[], rules: BurkozelRules): boolean {
  if (cards.length === 0) {
    return false;
  }

  const suits = new Set(cards.filter((card) => !isShokha(card, rules)).map((card) => card.suit));

  return suits.size <= 1;
}
