import type { TysyachaState } from '@durak-master/schemas';

import { MIN_BID } from '@durak-master/schemas';

import type { TysyachaReduceResult } from './shared';

import { userIdAtSeat } from '../../shared';
import { bidCeiling } from '../rules';
import { activeBidders, fail, highestBid, nextBidderSeat } from './shared';

export function applyBid(
  state: TysyachaState,
  seat: number,
  userId: string,
  value: number
): TysyachaReduceResult {
  if (state.stage !== 'bidding') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const best = highestBid(state);
  const minimum = best === 0 ? MIN_BID : best + state.rules.bidStep;

  if (value < minimum || value % state.rules.bidStep !== 0) {
    return fail('BID_TOO_LOW');
  }

  if (value > bidCeiling(state.hands[userId] ?? [])) {
    return fail('BID_TOO_LOW');
  }

  const bids = [...state.bids, { seat, value }];

  return {
    ok: true,
    state: {
      ...state,
      bids,
      activeSeat: nextBidderSeat({ ...state, bids }, seat),
      version: state.version + 1
    }
  };
}

export function applyPass(state: TysyachaState, seat: number): TysyachaReduceResult {
  if (state.stage !== 'bidding') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const bids = [...state.bids, { seat, value: null }];
  const remaining = activeBidders({ ...state, bids });

  if (remaining.length > 1) {
    return {
      ok: true,
      state: {
        ...state,
        bids,
        activeSeat: nextBidderSeat({ ...state, bids }, seat),
        version: state.version + 1
      }
    };
  }

  const declarerSeat = remaining[0] ?? seat;
  const declarer = userIdAtSeat(state.players, declarerSeat);

  if (!declarer) {
    return fail('NOT_IN_GAME');
  }

  const contract = Math.max(highestBid({ ...state, bids }), MIN_BID);

  return {
    ok: true,
    state: {
      ...state,
      bids,
      stage: 'discarding',
      contract,
      declarerSeat,
      hands: { ...state.hands, [declarer]: [...(state.hands[declarer] ?? []), ...state.widow] },
      activeSeat: declarerSeat,
      version: state.version + 1
    }
  };
}
