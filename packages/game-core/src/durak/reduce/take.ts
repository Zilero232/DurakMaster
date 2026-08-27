import type { DurakState } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { fail } from './shared';

export function applyTake(state: DurakState, seat: number): DurakReduceResult {
  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.table.length === 0) {
    return fail('NOTHING_TO_TAKE');
  }

  const next: DurakState = {
    ...state,
    isTaking: true,
    activeSeat: state.attackerSeat,
    passedSeats: [],
    version: state.version + 1
  };

  return { ok: true, state: next };
}
