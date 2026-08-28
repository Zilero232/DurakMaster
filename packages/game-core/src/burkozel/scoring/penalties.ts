import type { BurkozelRules, PlayerState } from '@durak-master/schemas';

import { PENALTY_FREE_THRESHOLD } from '@durak-master/schemas';

/** Three-handed solo splits the pot three ways, so the free ride is cheaper. */
export function pointsThreshold(playerCount: number, rules: BurkozelRules): number {
  return playerCount === 3 && rules.teamMode === 'solo'
    ? PENALTY_FREE_THRESHOLD.threeWay
    : PENALTY_FREE_THRESHOLD.twoSided;
}

/**
 * What a side pays for a deal. Losing costs more the worse it went: taking no
 * trick at all is the heaviest, and a tie at the top penalises both sides.
 */
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
