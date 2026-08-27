import type { KozelState, KozelView } from '@durak-master/schemas';

import { otherTeam, teamOfSeat } from '../shared';
import { handPoints } from './rules';

const handCountsOf = (state: KozelState): Record<string, number> => {
  const counts: Record<string, number> = {};

  for (const player of state.players) {
    counts[player.userId] = state.hands[player.userId]?.length ?? 0;
  }

  return counts;
};

/** Points a team has taken so far this deal, summed over both partners' tricks. */
const teamPoints = (state: KozelState, team: 0 | 1): number => {
  let total = 0;

  for (const player of state.players) {
    if (teamOfSeat(player.seat) === team) {
      total += handPoints(state.wonCards[player.userId] ?? []);
    }
  }

  return total;
};

/**
 * What one player is allowed to see. Other hands never leave the server — only
 * their sizes do. Both teams' running point totals are public: at a real table
 * the taken tricks lie face up.
 */
export function toPlayerView(state: KozelState, userId: string): KozelView {
  const { hands: _hands, wonCards: _wonCards, ...rest } = state;

  const seat = state.players.find((player) => player.userId === userId)?.seat ?? 0;
  const myTeam = teamOfSeat(seat) as 0 | 1;

  return {
    ...rest,
    hand: state.hands[userId] ?? [],
    handCounts: handCountsOf(state),
    myTeam,
    myTeamPoints: teamPoints(state, myTeam),
    opponentPoints: teamPoints(state, otherTeam(myTeam) as 0 | 1)
  };
}
