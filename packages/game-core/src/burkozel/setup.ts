import type { BurkozelState, Card, PlayerState, SettingsForGame } from '@durak-master/schemas';

import { BURKOZEL_HAND_SIZE } from '@durak-master/schemas';

import { buildDeck, shuffle } from '../shared';

export type CreateBurkozelGameInput = {
  tableId: string;
  settings: SettingsForGame<'burkozel'>;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

export function createGame(input: CreateBurkozelGameInput): BurkozelState {
  const { tableId, settings, userIds, randomInt } = input;
  const { rules } = settings;

  const deck = shuffle(buildDeck(36), randomInt);

  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: BURKOZEL_HAND_SIZE,
    isOut: false,
    isDisconnected: false
  }));

  const hands: Record<string, Card[]> = {};
  const wonCards: Record<string, Card[]> = {};
  const tricksWon: Record<string, number> = {};
  const penalties: Record<string, number> = {};
  let cursor = 0;

  for (const player of players) {
    hands[player.userId] = deck.slice(cursor, cursor + BURKOZEL_HAND_SIZE);
    wonCards[player.userId] = [];
    tricksWon[player.userId] = 0;
    penalties[player.userId] = 0;
    cursor += BURKOZEL_HAND_SIZE;
  }

  const talon = deck.slice(cursor);
  const trumpCard = talon[talon.length - 1] ?? null;
  const trump = trumpCard?.suit ?? 'spades';
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
    activeSeat: leadSeat,
    turnDeadline: null,
    version: 0,
    loserUserId: null,
    isDraw: false
  };
}
