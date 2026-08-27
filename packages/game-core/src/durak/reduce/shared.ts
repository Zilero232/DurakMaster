import type { DurakState, GameErrorCode, PlayerState } from '@durak-master/schemas';

import type { ReduceResult } from '../../module';

export type DurakReduceResult = ReduceResult<'durak'>;

export const fail = (error: GameErrorCode): DurakReduceResult => ({ ok: false, error });

export const playerAtSeat = (state: DurakState, seat: number): PlayerState | undefined =>
  state.players.find((player) => player.seat === seat);

export const handSizeAtSeat = (state: DurakState, seat: number): number => {
  const player = playerAtSeat(state, seat);

  return player ? (state.hands[player.userId]?.length ?? 0) : 0;
};

export const syncHandCounts = (state: DurakState): DurakState => ({
  ...state,
  players: state.players.map((player) => ({
    ...player,
    handCount: state.hands[player.userId]?.length ?? 0
  }))
});
