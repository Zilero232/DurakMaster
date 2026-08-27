import type { TysyachaState } from '@durak-master/schemas';

import type { CreateTysyachaGameInput } from './create-game';

import { HAND_SIZE } from '../config';
import { deal } from './deal';

export const startNextDeal = (
  state: TysyachaState,
  randomInt: CreateTysyachaGameInput['randomInt']
): TysyachaState => {
  const dealerSeat = (state.dealerSeat + 1) % state.players.length;
  const firstBidder = (dealerSeat + 1) % state.players.length;

  const { hands, wonCards, widow } = deal(state.players, randomInt);

  return {
    ...state,
    stage: 'bidding',
    hands,
    widow,
    bids: [],
    contract: null,
    declarerSeat: null,
    trick: [],
    leadSeat: firstBidder,
    trump: null,
    declaredMarriages: [],
    wonCards,
    dealNumber: state.dealNumber + 1,
    dealerSeat,
    activeSeat: firstBidder,
    turnDeadline: null,
    players: state.players.map((player) => ({ ...player, handCount: HAND_SIZE })),
    version: state.version + 1
  };
};
