import type { KozelState } from '@durak-master/schemas';

import type { KozelReduceResult } from './shared';

import { seatOf, teamOfSeat } from '../../shared';
import { fail } from './shared';

/**
 * The winning team names which of its two players opens the deal — a real step,
 * taken after the cards are seen, not something the server can decide alone.
 */
export const chooseLeader = (
  state: KozelState,
  userId: string,
  seat: number
): KozelReduceResult => {
  const actorSeat = seatOf(state.players, userId);

  if (actorSeat === null) {
    return fail('NOT_IN_GAME');
  }

  if (state.phase !== 'chooseLeader') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const choosingTeam = teamOfSeat(state.leadSeat);

  if (teamOfSeat(actorSeat) !== choosingTeam || teamOfSeat(seat) !== choosingTeam) {
    return fail('NOT_YOUR_TEAM');
  }

  return {
    ok: true,
    state: {
      ...state,
      phase: 'playing',
      leadSeat: seat,
      activeSeat: seat,
      version: state.version + 1
    }
  };
};
