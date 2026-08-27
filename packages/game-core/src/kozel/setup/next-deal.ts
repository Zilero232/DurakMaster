import type { KozelState } from '@durak-master/schemas';

import { KOZEL_HAND_SIZE } from '@durak-master/schemas';

import { teamOfSeat } from '../../shared';
import { KOZEL_SEATS, PLAIN_SUITS } from '../config';
import { dealHands } from './deal';

type StartDealInput = {
  state: KozelState;
  randomInt: (maxExclusive: number) => number;
};

/**
 * Opens the next deal. From the second deal on the winning team chooses which of
 * its two players leads, so the deal starts in `chooseLeader` rather than going
 * straight to a trick.
 */
export const startNextDeal = ({ state, randomInt }: StartDealInput): KozelState => {
  const dealerSeat = (state.dealerSeat + 1) % KOZEL_SEATS;
  const { hands, wonCards, tricksWon } = dealHands({
    players: state.players,
    dealerSeat,
    randomInt
  });

  const [pointsA, pointsB] = state.lastDealPoints ?? [0, 0];
  const winnerTeam = pointsA === pointsB ? teamOfSeat(dealerSeat) : pointsA > pointsB ? 0 : 1;

  // Either partner of the winning team may lead; the seat is settled by `chooseLeader`.
  const candidateSeat =
    state.players.find((player) => teamOfSeat(player.seat) === winnerTeam)?.seat ?? 0;

  return {
    ...state,
    phase: 'chooseLeader',
    hands,
    wonCards,
    tricksWon,

    trick: [],
    leadSeat: candidateSeat,
    trickNumber: 0,
    unledSuits: [...PLAIN_SUITS],
    isDealComplete: false,

    dealNumber: state.dealNumber + 1,
    dealerSeat,

    activeSeat: candidateSeat,
    turnDeadline: null,

    players: state.players.map((player) => ({ ...player, handCount: KOZEL_HAND_SIZE }))
  };
};
