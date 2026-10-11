import type { DurakState, Rank, TablePair } from '@durak-master/schemas';

import { isJoker } from '@durak-master/schemas';

import { nextActiveSeat, previousActiveSeat } from '../../shared';

export function allowedThrowInRanks(table: readonly TablePair[]): Set<Rank> {
  const ranks = new Set<Rank>();

  for (const pair of table) {
    if (!isJoker(pair.attack)) {
      ranks.add(pair.attack.rank);
    }

    if (pair.defense && !isJoker(pair.defense)) {
      ranks.add(pair.defense.rank);
    }
  }

  return ranks;
}

export function canThrowIn(
  seat: number,
  state: Pick<DurakState, 'attackerSeat' | 'defenderSeat' | 'players' | 'rules'>
): boolean {
  if (seat === state.defenderSeat) {
    return false;
  }

  const player = state.players.find((item) => item.seat === seat);

  if (!player || player.isOut) {
    return false;
  }

  if (seat === state.attackerSeat) {
    return true;
  }

  if (state.rules.throwInScope === 'all') {
    return true;
  }

  const seatBeforeDefender = previousActiveSeat(state.players, state.defenderSeat);
  const seatAfterDefender = nextActiveSeat(state.players, state.defenderSeat);

  return seat === seatBeforeDefender || seat === seatAfterDefender;
}
