import type { GameErrorCode, TysyachaState } from '@durak-master/schemas';

import type { ReduceResult } from '../../module';

import { nextSeat } from '../../shared';

export type TysyachaReduceResult = ReduceResult<'tysyacha'>;

export const fail = (error: GameErrorCode): TysyachaReduceResult => ({ ok: false, error });

export const activeBidders = (state: TysyachaState): number[] =>
  state.players
    .map((player) => player.seat)
    .filter((seat) => !state.bids.some((bid) => bid.seat === seat && bid.value === null));

export const highestBid = (state: TysyachaState): number =>
  state.bids.reduce((best, bid) => Math.max(best, bid.value ?? 0), 0);

export const nextBidderSeat = (state: TysyachaState, from: number): number => {
  const remaining = activeBidders(state);

  let seat = nextSeat(state.players, from);

  while (!remaining.includes(seat)) {
    seat = nextSeat(state.players, seat);
  }

  return seat;
};
