import type { TysyachaState } from '@durak-master/schemas';

import type { TysyachaReduceResult } from './shared';

import { settleConcession } from '../scoring';
import { fail } from './shared';

export function applyConcede(state: TysyachaState, seat: number): TysyachaReduceResult {
  if (state.stage !== 'playing' || seat !== state.declarerSeat) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const scores = settleConcession(state);
  const winner = state.players.find(
    (player) => (scores[player.userId] ?? 0) >= state.rules.winningScore
  );

  return {
    ok: true,
    state: {
      ...state,
      scores,
      stage: 'scoring',
      phase: winner ? 'finished' : 'playing',
      winnerUserId: winner?.userId ?? null,
      version: state.version + 1
    }
  };
}
