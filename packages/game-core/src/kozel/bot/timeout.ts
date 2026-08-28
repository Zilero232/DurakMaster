import type { KozelAction, KozelState } from '@durak-master/schemas';

import { seatOf } from '../../shared';
import { allowedCards, cheapest } from './shared';

/** On a timeout the player just puts down a legal card, the cheapest one. */
export function decideTimeoutAction(state: KozelState, userId: string): KozelAction {
  if (state.phase === 'chooseLeader') {
    return { type: 'chooseLeader', seat: seatOf(state.players, userId) ?? 0 };
  }

  const allowed = allowedCards(state, userId);
  const [fallback] = allowed;

  return { type: 'play', card: cheapest(allowed) ?? fallback ?? { rank: 'seven', suit: 'clubs' } };
}
