import type { TysyachaState } from '@durak-master/schemas';

import type { TysyachaReduceResult } from './shared';

import { userIdAtSeat } from '../../shared';
import { trickWinnerSeat } from '../rules';
import { settleDeal } from '../scoring';
import { fail } from './shared';

export function finishTrick(state: TysyachaState): TysyachaReduceResult {
  const winnerSeat = trickWinnerSeat(state);
  const winner = userIdAtSeat(state.players, winnerSeat);

  if (!winner) {
    return fail('NOT_IN_GAME');
  }

  const wonCards = {
    ...state.wonCards,
    [winner]: [...(state.wonCards[winner] ?? []), ...state.trick.map((entry) => entry.card)]
  };

  const isDealOver = state.players.every(
    (player) => (state.hands[player.userId] ?? []).length === 0
  );

  const base: TysyachaState = {
    ...state,
    wonCards,
    trick: [],
    leadSeat: winnerSeat,
    activeSeat: winnerSeat,
    players: state.players.map((player) => ({
      ...player,
      handCount: (state.hands[player.userId] ?? []).length
    })),
    version: state.version + 1
  };

  if (!isDealOver) {
    return { ok: true, state: base };
  }

  return { ok: true, state: finishDeal(base) };
}

function finishDeal(state: TysyachaState): TysyachaState {
  const scores = settleDeal(state);
  const winner = state.players.find(
    (player) => (scores[player.userId] ?? 0) >= state.rules.winningScore
  );

  return {
    ...state,
    scores,
    stage: 'scoring',
    phase: winner ? 'finished' : 'playing',
    winnerUserId: winner?.userId ?? null
  };
}
