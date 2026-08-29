import type { KozelState, PlayerState, SettingsForGame } from '@durak-master/schemas';

import { KOZEL_HAND_SIZE } from '@durak-master/schemas';

import { PLAIN_SUITS } from '../config';
import { dealHands } from './deal';
import { firstLeadSeat } from './seats';

export type CreateKozelGameInput = {
  tableId: string;
  settings: SettingsForGame<'kozel'>;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

export function createGame(input: CreateKozelGameInput): KozelState {
  const { tableId, settings, userIds, randomInt } = input;
  const { rules } = settings;

  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: KOZEL_HAND_SIZE,
    isOut: false,
    outPlace: null,
    isDisconnected: false
  }));

  const dealerSeat = randomInt(players.length);
  const { hands, wonCards, tricksWon, lowestTrumpSeat } = dealHands({
    players,
    dealerSeat,
    randomInt
  });

  const leadSeat = firstLeadSeat({ settings, dealerSeat, lowestTrumpSeat });

  return {
    game: 'kozel',
    rules,
    tableId,
    phase: 'playing',
    players,

    hands,

    trick: [],
    leadSeat,
    trickNumber: 0,
    unledSuits: [...PLAIN_SUITS],

    wonCards,
    tricksWon,

    pairs: [0, 0],
    hadEggs: false,
    lastDealPoints: null,
    isDealComplete: false,

    dealNumber: 0,
    dealerSeat,

    activeSeat: leadSeat,
    turnDeadline: null,
    version: 0,

    loserTeam: null,
    isDraw: false
  };
}
