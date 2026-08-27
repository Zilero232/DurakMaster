import type { DurakState } from '@durak-master/schemas';

import type { DurakReduceResult } from './shared';

import { canThrowIn, hasUndefendedCards } from '../rules';
import { finishBout } from './finish-bout';
import { fail } from './shared';

export function applyPass(state: DurakState, seat: number): DurakReduceResult {
  if (seat === state.defenderSeat) {
    return fail('CANNOT_PASS_AS_DEFENDER');
  }

  if (state.table.length === 0) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const passedSeats = state.passedSeats.includes(seat)
    ? state.passedSeats
    : [...state.passedSeats, seat];

  const attackers = state.players.filter((item) => canThrowIn(item.seat, state));
  const everyonePassed = attackers.every((item) => passedSeats.includes(item.seat));

  if (!everyonePassed) {
    return {
      ok: true,
      state: { ...state, passedSeats, activeSeat: state.attackerSeat, version: state.version + 1 }
    };
  }

  if (state.isTaking) {
    return { ok: true, state: finishBout(state, { defenderTook: true }) };
  }

  if (hasUndefendedCards(state.table)) {
    return {
      ok: true,
      state: { ...state, passedSeats, activeSeat: state.defenderSeat, version: state.version + 1 }
    };
  }

  return { ok: true, state: finishBout(state, { defenderTook: false }) };
}
