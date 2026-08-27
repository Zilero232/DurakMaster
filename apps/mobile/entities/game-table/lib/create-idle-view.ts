import type { LobbyTable, ViewForGame } from '@durak-master/schemas';

type DurakRules = ViewForGame<'durak'>['rules'];

export const createIdleView = (table: LobbyTable, rules: DurakRules): ViewForGame<'durak'> => ({
  game: 'durak',
  tableId: table.id,
  rules,
  players: table.players.map((player) => ({
    userId: player.userId,
    seat: player.seat,
    handCount: 0,
    isOut: false,
    isDisconnected: false
  })),
  hand: [],
  talonCount: 0,
  discardCount: 0,
  trump: 'spades',
  trumpCard: null,
  table: [],
  attackerSeat: 0,
  defenderSeat: 0,
  attackLimit: 0,
  passedSeats: [],
  shownTrumpSeats: [],
  isTaking: false,
  activeSeat: -1,
  phase: 'waiting',
  turnDeadline: null,
  loserUserId: null,
  isDraw: false,
  version: 0
});
