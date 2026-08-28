import type { Card, TysyachaState } from '@durak-master/schemas';

import { beats, bestCard } from './beating';

export const legalPlays = (hand: Card[], state: TysyachaState): Card[] => {
  const lead = state.trick[0]?.card;

  if (!lead) {
    return hand;
  }

  const sameSuit = hand.filter((card) => card.suit === lead.suit);
  const best = bestCard(state);

  if (sameSuit.length > 0) {
    const higher = sameSuit.filter((card) => best !== null && beats(card, best, state.trump));

    return higher.length > 0 ? higher : sameSuit;
  }

  if (state.trump === null) {
    return hand;
  }

  const trumps = hand.filter((card) => card.suit === state.trump);

  return trumps.length > 0 ? trumps : hand;
};
