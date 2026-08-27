import type { DurakState, TablePair } from '@durak-master/schemas';

export function allowedThrowInRanks(table: readonly TablePair[]): Set<string> {
  const ranks = new Set<string>();

  for (const pair of table) {
    ranks.add(pair.attack.rank);

    if (pair.defense) {
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

  if (state.rules.throwInScope === 'all') {
    return true;
  }

  const count = state.players.length;
  const leftOfDefender = (state.defenderSeat + count - 1) % count;
  const rightOfDefender = (state.defenderSeat + 1) % count;

  return seat === leftOfDefender || seat === rightOfDefender;
}
