import type { Card, GameErrorCode } from '@durak-master/schemas';

import type { ReduceResult } from '../../module';

import { cardsEqual } from '../../shared';

export type BurkozelReduceResult = ReduceResult<'burkozel'>;

export const fail = (error: GameErrorCode): BurkozelReduceResult => ({ ok: false, error });

/**
 * The hand without the played cards, or `null` when it does not hold them all.
 * Removes one copy per requested card rather than filtering, so a play never
 * strips more of the hand than it names.
 */
export const removeCards = (hand: readonly Card[], cards: readonly Card[]): Card[] | null => {
  const rest = [...hand];

  for (const card of cards) {
    const index = rest.findIndex((item) => cardsEqual(item, card));

    if (index === -1) {
      return null;
    }

    rest.splice(index, 1);
  }

  return rest;
};
