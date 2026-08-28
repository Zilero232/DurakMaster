import type { DurakAction, DurakState } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { seatOf } from '../../shared';
import { applyAttack } from './attack';
import { applyDefend } from './defend';
import { applyPass } from './pass';
import { fail, playerAtSeat } from './shared';
import { applyTake } from './take';
import { applyTransfer, applyTransferByShowing } from './transfer';

export type { DurakReduceResult } from './shared';

export function reduce(state: DurakState, userId: string, action: DurakAction): DurakReduceResult {
  if (state.phase === 'finished') {
    return fail('GAME_NOT_ACTIVE');
  }

  const seat = seatOf(state.players, userId);

  if (seat === null) {
    return fail('NOT_IN_GAME');
  }

  const player = playerAtSeat(state, seat);

  if (!player || player.isOut) {
    return fail('NOT_IN_GAME');
  }

  switch (action.type) {
    case 'attack':
      return applyAttack(state, seat, userId, action.card);
    case 'defend':
      return applyDefend(state, seat, userId, action.pairIndex, action.card);
    case 'transfer':
      return applyTransfer(state, seat, userId, action.card);
    case 'transferByShowing':
      return applyTransferByShowing(state, seat, userId, action.card);
    case 'take':
      return applyTake(state, seat);
    case 'pass':
      return applyPass(state, seat);
    default:
      return fail('INVALID_ACTION_FOR_PHASE');
  }
}
