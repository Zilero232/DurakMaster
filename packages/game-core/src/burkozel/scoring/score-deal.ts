import type { BurkozelState, Card } from '@durak-master/schemas';

import { teamOfSeat } from '../../shared';
import { setPoints } from '../rules';
import { dealPenalty, pointsThreshold } from './penalties';
import { isTeamGame, teammates } from './teams';

export type DealOutcome = {
  points: Record<string, number>;
  penalties: Record<string, number>;
};

export function scoreDeal(state: BurkozelState): DealOutcome {
  const points: Record<string, number> = {};
  const sidePoints: Record<string, number> = {};
  const sideTricks: Record<string, number> = {};

  for (const player of state.players) {
    points[player.userId] = setPoints(state.wonCards[player.userId] ?? []);
  }

  for (const player of state.players) {
    const side = teammates(state.players, player, state.rules);

    sidePoints[player.userId] = side.reduce((sum, item) => sum + (points[item.userId] ?? 0), 0);
    sideTricks[player.userId] = side.reduce(
      (sum, item) => sum + (state.tricksWon[item.userId] ?? 0),
      0
    );
  }

  const best = Math.max(...Object.values(sidePoints));
  const topSides = new Set(
    state.players
      .filter((player) => sidePoints[player.userId] === best)
      .map((player) => teamOfSeat(player.seat))
  );
  // In pairs both partners share the top score, so a tie means two distinct sides at the top.
  const isTied = isTeamGame(state.players, state.rules)
    ? topSides.size > 1
    : state.players.filter((player) => sidePoints[player.userId] === best).length > 1;
  const threshold = pointsThreshold(state.players.length, state.rules);

  const penalties: Record<string, number> = {};

  for (const player of state.players) {
    penalties[player.userId] = dealPenalty(
      sidePoints[player.userId] ?? 0,
      sideTricks[player.userId] ?? 0,
      sidePoints[player.userId] === best,
      isTied,
      threshold
    );
  }

  return { points, penalties };
}

export function totalDealtPoints(wonCards: Record<string, Card[]>): number {
  return Object.values(wonCards).reduce((sum, cards) => sum + setPoints(cards), 0);
}
