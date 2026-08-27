import type { Card, GameErrorCode } from '@durak-master/schemas';

import type { ReduceResult } from '../../module';

import { cardsEqual } from '../../shared';

export type KozelReduceResult = ReduceResult<'kozel'>;

export const fail = (error: GameErrorCode): KozelReduceResult => ({ ok: false, error });

/**
 * Drops one copy of a card from a hand, or reports `null` when the hand never
 * held it — the caller turns that into `CARD_NOT_IN_HAND` rather than silently
 * playing a card out of thin air.
 */
export const removeCard = (hand: readonly Card[], card: Card): Card[] | null => {
  const index = hand.findIndex((item) => cardsEqual(item, card));

  if (index === -1) {
    return null;
  }

  const rest = [...hand];

  rest.splice(index, 1);

  return rest;
};
