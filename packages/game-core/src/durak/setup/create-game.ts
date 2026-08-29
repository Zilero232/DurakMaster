import type { Card, DurakState, PlayerState, SettingsForGame } from '@durak-master/schemas';

import { buildDeck, shuffle } from '../../shared';
import { HAND_SIZE } from '../config';
import { computeAttackLimit } from '../rules';
import { findFirstAttackerSeat, nextActiveSeat } from './seats';

export type CreateDurakGameInput = {
  tableId: string;
  settings: SettingsForGame<'durak'>;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

export function createGame(input: CreateDurakGameInput): DurakState {
  const { tableId, settings, userIds, randomInt } = input;
  const { rules } = settings;

  const deck = shuffle(buildDeck(rules.deckSize), randomInt);

  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: HAND_SIZE,
    isOut: false,
    outPlace: null,
    isDisconnected: false
  }));

  const hands: Record<string, Card[]> = {};
  let cursor = 0;

  for (const player of players) {
    hands[player.userId] = deck.slice(cursor, cursor + HAND_SIZE);
    cursor += HAND_SIZE;
  }

  const rest = deck.slice(cursor);
  const trumpCard = rest[rest.length - 1] ?? null;
  const trump = trumpCard?.suit ?? 'spades';

  const attackerSeat =
    rules.firstMove === 'lowestTrump'
      ? findFirstAttackerSeat(hands, players, trump)
      : (players[randomInt(players.length)]?.seat ?? 0);
  const defenderSeat = nextActiveSeat(players, attackerSeat);
  const defenderId = players.find((player) => player.seat === defenderSeat)?.userId;
  const defenderHandSize = defenderId ? (hands[defenderId]?.length ?? 0) : 0;

  return {
    game: 'durak',
    rules,
    tableId,
    phase: 'playing',
    isTaking: false,
    players,
    hands,
    talon: rest,
    trump,
    trumpCard,
    table: [],
    discard: [],
    attackerSeat,
    defenderSeat,
    activeSeat: attackerSeat,
    attackLimit: computeAttackLimit(rules.attackLimit, defenderHandSize),
    passedSeats: [],
    shownTrumpSeats: [],
    turnDeadline: null,
    version: 0,
    loserUserId: null,
    isDraw: false
  };
}
