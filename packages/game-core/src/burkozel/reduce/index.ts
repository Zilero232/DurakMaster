import type { BurkozelAction, BurkozelState } from '@durak-master/schemas';

import type { BurkozelReduceResult } from './shared';

import { seatOf } from '../../shared';
import { playCards } from './play';
import { fail } from './shared';

export type { BurkozelReduceResult } from './shared';

export function reduce(
  state: BurkozelState,
  userId: string,
  action: BurkozelAction
): BurkozelReduceResult {
  if (state.phase !== 'playing') {
    return fail('GAME_NOT_ACTIVE');
  }

  const seat = seatOf(state.players, userId);

  if (seat === null) {
    return fail('NOT_IN_GAME');
  }

  if (seat !== state.activeSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (action.type === 'play') {
    return playCards(state, userId, seat, action.cards);
  }

  return fail('INVALID_ACTION_FOR_PHASE');
}
