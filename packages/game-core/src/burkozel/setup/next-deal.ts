import type { BurkozelState } from '@durak-master/schemas';

import { BURKOZEL_HAND_SIZE } from '@durak-master/schemas';

import { nextSeat } from '../../shared';
import { deal } from './deal';

/**
 * Opens the next deal once the previous one has been scored. Penalties carry
 * over — they are what the match is played to — while the cards, tricks and the
 * trump are dealt afresh. The lead passes clockwise from the previous one.
 */
export function startNextDeal(
  state: BurkozelState,
  randomInt: (maxExclusive: number) => number
): BurkozelState {
  const { hands, wonCards, tricksWon, talon, trumpCard, trump } = deal(state.players, randomInt);

  const leadSeat = nextSeat(state.players, state.leadSeat);

  return {
    ...state,
    hands,
    talon,
    trump,
    trumpCard,

    trick: [],
    leadSeat,
    bestPlayIndex: null,

    wonCards,
    tricksWon,

    isDealComplete: false,
    dealNumber: state.dealNumber + 1,

    activeSeat: leadSeat,
    turnDeadline: null,

    players: state.players.map((player) => ({ ...player, handCount: BURKOZEL_HAND_SIZE })),
    version: state.version + 1
  };
}
