import type { BurkozelRules, PlayerState } from '@durak-master/schemas';

import { teamOfSeat } from '../../shared';

/** Pairs are only played four-handed; three-handed burkozel is every man for himself. */
export function isTeamGame(players: PlayerState[], rules: BurkozelRules): boolean {
  return rules.teamMode === 'pairs' && players.length === 4;
}

/**
 * The side a player scores with. Solo play returns the player alone, so the
 * rest of the scoring can treat both modes the same way.
 */
export function teammates(
  players: PlayerState[],
  player: PlayerState,
  rules: BurkozelRules
): PlayerState[] {
  if (!isTeamGame(players, rules)) {
    return [player];
  }

  return players.filter((item) => teamOfSeat(item.seat) === teamOfSeat(player.seat));
}
