import type { BurkozelState, PlayerState, SettingsForGame } from '@durak-master/schemas';

import { BURKOZEL_HAND_SIZE } from '@durak-master/schemas';

import { deal } from './deal';

export type CreateBurkozelGameInput = {
  tableId: string;
  settings: SettingsForGame<'burkozel'>;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

export function createGame(input: CreateBurkozelGameInput): BurkozelState {
  const { tableId, settings, userIds, randomInt } = input;
  const { rules } = settings;

  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: BURKOZEL_HAND_SIZE,
    isOut: false,
    isDisconnected: false
  }));

  const { hands, wonCards, tricksWon, talon, trumpCard, trump } = deal(players, randomInt);

  const penalties: Record<string, number> = {};

  for (const player of players) {
    penalties[player.userId] = 0;
  }

  const leadSeat = players[randomInt(players.length)]?.seat ?? 0;

  return {
    game: 'burkozel',
    rules,
    tableId,
    phase: 'playing',
    players,
    hands,
    talon,
    trump,
    trumpCard,
    trick: [],
    leadSeat,
    bestPlayIndex: null,
    wonCards,
    tricksWon,
    penalties,
    isDealComplete: false,
    dealNumber: 1,
    activeSeat: leadSeat,
    turnDeadline: null,
    version: 0,
    loserUserId: null,
    isDraw: false
  };
}
