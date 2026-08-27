import type { BurkozelRules, BurkozelState, Card, PlayerState } from '@durak-master/schemas';

import { PENALTY_FREE_THRESHOLD } from '@durak-master/schemas';

import { setPoints } from './rules';

export type DealOutcome = {
  points: Record<string, number>;
  penalties: Record<string, number>;
};

export function isTeamGame(players: PlayerState[], rules: BurkozelRules): boolean {
  return rules.teamMode === 'pairs' && players.length === 4;
}

export function teamOf(seat: number): number {
  return seat % 2;
}

export function teammates(
  players: PlayerState[],
  player: PlayerState,
  rules: BurkozelRules
): PlayerState[] {
  if (!isTeamGame(players, rules)) {
    return [player];
  }

  return players.filter((item) => teamOf(item.seat) === teamOf(player.seat));
}

function pointsThreshold(playerCount: number, rules: BurkozelRules): number {
  return playerCount === 3 && rules.teamMode === 'solo'
    ? PENALTY_FREE_THRESHOLD.threeWay
    : PENALTY_FREE_THRESHOLD.twoSided;
}

export function dealPenalty(
  points: number,
  tricks: number,
  isTopScorer: boolean,
  isTied: boolean,
  threshold: number
): number {
  if (isTopScorer) {
    return isTied ? 2 : 0;
  }

  if (points >= threshold) {
    return 2;
  }

  return tricks > 0 ? 4 : 6;
}

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
      .map((player) => teamOf(player.seat))
  );
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

export function eliminatedPlayer(
  players: PlayerState[],
  penalties: Record<string, number>,
  limit: number
): string | null {
  const reached = players.filter((player) => (penalties[player.userId] ?? 0) >= limit);

  if (reached.length === 0) {
    return null;
  }

  let worst = reached[0];

  for (const player of reached) {
    if (!worst || (penalties[player.userId] ?? 0) > (penalties[worst.userId] ?? 0)) {
      worst = player;
    }
  }

  return worst?.userId ?? null;
}

export function totalDealtPoints(wonCards: Record<string, Card[]>): number {
  return Object.values(wonCards).reduce((sum, cards) => sum + setPoints(cards), 0);
}
