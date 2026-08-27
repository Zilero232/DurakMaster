import type { Card, KozelState } from '@durak-master/schemas';

import { cardPoints, legalCards } from '../rules';

/** The cards the bot may put down in the position the state is currently in. */
export const allowedCards = (state: KozelState, userId: string): Card[] =>
  legalCards({
    hand: state.hands[userId] ?? [],
    trick: state.trick.map((entry) => entry.card),
    rules: state.rules,
    isFirstTrick: state.trickNumber === 0,
    unledSuits: new Set(state.unledSuits)
  });

/** The card that hands the fewest points to whoever takes the trick. */
export const cheapest = (cards: readonly Card[]): Card | null =>
  cards.reduce<Card | null>((best, card) => {
    if (!best) {
      return card;
    }

    return cardPoints(card) < cardPoints(best) ? card : best;
  }, null);
