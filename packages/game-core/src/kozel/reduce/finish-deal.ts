import type { Card, KozelState } from '@durak-master/schemas';

import { otherTeam, withHandCounts } from '../../shared';
import { scoreDeal } from '../scoring';

/**
 * Applies the finished deal to the scoreboard and decides whether the game is
 * over. A "lyusya" resets the opponent instead of paying pairs, so a team's
 * count is not monotonic and the target check has to run on the fresh values.
 */
export const finishDeal = (state: KozelState, hands: Record<string, Card[]>): KozelState => {
  const seatByUserId: Record<string, number> = {};

  for (const player of state.players) {
    seatByUserId[player.userId] = player.seat;
  }

  const outcome = scoreDeal({
    wonCards: state.wonCards,
    tricksWon: state.tricksWon,
    seatByUserId
  });

  const pairs: [number, number] = [
    state.pairs[0] + outcome.pairsGained[0],
    state.pairs[1] + outcome.pairsGained[1]
  ];

  if (outcome.resetTeam !== null) {
    pairs[outcome.resetTeam] = 0;
  }

  const { targetPairs } = state.rules;
  const winningTeam = pairs.findIndex((value) => value >= targetPairs);

  return {
    ...state,
    hands,
    players: withHandCounts(state.players, hands),
    pairs,
    hadEggs: state.hadEggs || outcome.hadEggs,
    lastDealPoints: outcome.points,
    // The cards are spent. Either the game is over, or the host deals again
    // through `startNextDeal` — the reducer has no randomness to do it itself.
    isDealComplete: winningTeam === -1,
    phase: winningTeam === -1 ? 'playing' : 'finished',
    loserTeam: winningTeam === -1 ? null : (otherTeam(winningTeam) as 0 | 1),
    trick: [],
    turnDeadline: null,
    version: state.version + 1
  };
};
