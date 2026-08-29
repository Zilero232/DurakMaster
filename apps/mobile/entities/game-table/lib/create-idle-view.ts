import type { LobbyTable, ViewForGame } from '@durak-master/schemas';

type DurakRules = ViewForGame<'durak'>['rules'];

export const createIdleView = (table: LobbyTable, rules: DurakRules): ViewForGame<'durak'> => ({
  game: 'durak',
  tableId: table.id,
  rules,
  players: Array.from({ length: table.settings.maxPlayers }, (_, seat) => {
    const taken = table.players.find((player) => player.seat === seat);

    return {
      userId: taken?.userId ?? `seat-${seat}`,
      seat,
      handCount: 0,
      isOut: false,
      outPlace: null,
      isDisconnected: false
    };
  }),
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
