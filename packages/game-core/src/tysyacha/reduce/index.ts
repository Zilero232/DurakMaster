import type { TysyachaAction, TysyachaState } from '@durak-master/schemas';

import type { TysyachaReduceResult } from './shared';

import { seatOf } from '../../shared';
import { applyBid, applyPass } from './bidding';
import { applyConcede } from './concede';
import { applyDiscard } from './discard';
import { applyMarriage, applyPlay } from './play';
import { fail } from './shared';

export type { TysyachaReduceResult } from './shared';

export function reduce(
  state: TysyachaState,
  userId: string,
  action: TysyachaAction
): TysyachaReduceResult {
  if (state.phase === 'finished') {
    return fail('GAME_NOT_ACTIVE');
  }

  const seat = seatOf(state.players, userId);

  if (seat === null) {
    return fail('NOT_IN_GAME');
  }

  if (seat !== state.activeSeat) {
    return fail('NOT_YOUR_TURN');
  }

  switch (action.type) {
    case 'bid':
      return applyBid(state, seat, userId, action.value);
    case 'pass':
      return applyPass(state, seat);
    case 'discard':
      return applyDiscard(state, seat, userId, action.cards, action.gifts);
    case 'play':
      return applyPlay(state, seat, userId, action.card);
    case 'declareMarriage':
      return applyMarriage(state, seat, userId, action.suit, action.card);
    case 'concede':
      return applyConcede(state, seat);
    default:
      return fail('INVALID_ACTION_FOR_PHASE');
  }
}
