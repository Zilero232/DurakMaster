import type { BurkozelState, Card, PlayerState } from '@durak-master/schemas';

import { withHandCounts } from '../../shared';
import { scoreDeal } from '../scoring';

/**
 * Closes a deal: its penalties are added to the running totals, and the match
 * ends as soon as anyone reaches the limit. The state stays in `playing` while
 * the match continues — the host deals again through `startNextDeal`.
 */
export function finishDeal(state: BurkozelState, hands: Record<string, Card[]>): BurkozelState {
  const outcome = scoreDeal(state);
  const penalties: Record<string, number> = {};

  for (const player of state.players) {
    penalties[player.userId] =
      (state.penalties[player.userId] ?? 0) + (outcome.penalties[player.userId] ?? 0);
  }

  const worst = state.players.reduce<PlayerState | null>((current, player) => {
    if (!current) {
      return player;
    }

    return (penalties[player.userId] ?? 0) > (penalties[current.userId] ?? 0) ? player : current;
  }, null);

  const reachedLimit = state.players.filter(
    (player) => (penalties[player.userId] ?? 0) >= state.rules.penaltyLimit
  );

  // Nobody has hit the penalty limit yet, so the match carries on with a fresh deal.
  const continues = reachedLimit.length === 0;

  return {
    ...state,
    hands,
    players: withHandCounts(state.players, hands),
    phase: continues ? 'playing' : 'finished',
    penalties,
    isDealComplete: true,
    turnDeadline: null,
    version: state.version + 1,
    loserUserId: continues ? null : (worst?.userId ?? null),
    isDraw: false
  };
}
