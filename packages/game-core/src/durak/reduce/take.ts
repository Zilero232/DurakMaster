import type { DurakState } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { finishBout } from './finish-bout';
import { fail, nextThrowerSeat } from './shared';

export function applyTake(state: DurakState, seat: number): DurakReduceResult {
  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.table.length === 0) {
    return fail('NOTHING_TO_TAKE');
  }

  if (state.isTaking) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const waiting = nextThrowerSeat(state);

  const taking: DurakState = { ...state, isTaking: true };

  if (waiting === undefined) {
    return { ok: true, state: finishBout(taking, { defenderTook: true }) };
  }

  return {
    ok: true,
    state: { ...taking, activeSeat: waiting, version: state.version + 1 }
  };
}
