import type { PlayerState, TysyachaState } from '@durak-master/schemas';

import { HAND_SIZE } from '../config';
import { deal } from './deal';

export type CreateTysyachaGameInput = {
  tableId: string;
  settings: { rules: TysyachaState['rules'] };
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

export const createGame = ({
  tableId,
  settings,
  userIds,
  randomInt
}: CreateTysyachaGameInput): TysyachaState => {
  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: HAND_SIZE,
    isOut: false,
    isDisconnected: false
  }));

  const { hands, wonCards, widow } = deal(players, randomInt);

  const scores: Record<string, number> = {};
  const bolts: Record<string, number> = {};
  const barrelAttempts: Record<string, number> = {};

  for (const player of players) {
    scores[player.userId] = 0;
    bolts[player.userId] = 0;
    barrelAttempts[player.userId] = 0;
  }

  const dealerSeat = 0;
  const firstBidder = (dealerSeat + 1) % players.length;

  return {
    game: 'tysyacha',
    tableId,
    rules: settings.rules,
    players,
    stage: 'bidding',
    phase: 'playing',
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
    scores,
    bolts,
    barrelAttempts,
    dealNumber: 1,
    dealerSeat,
    activeSeat: firstBidder,
    turnDeadline: null,
    version: 0,
    winnerUserId: null
  };
};
