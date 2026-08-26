import type { Card, GameState, PlayerState, TableSettings } from '@durak-master/schemas';

import { buildDeck, rankValue, shuffle } from './deck';
import { computeAttackLimit } from './rules';

export type CreateGameInput = {
  tableId: string;
  settings: TableSettings;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

const HAND_SIZE = 6;

export function findFirstAttackerSeat(
  hands: Record<string, Card[]>,
  players: PlayerState[],
  trump: GameState['trump']
): number {
  let bestSeat = players[0]?.seat ?? 0;
  let bestTrump: number | null = null;
  let bestAny: number | null = null;
  let bestAnySeat = bestSeat;

  for (const player of players) {
    const hand = hands[player.userId] ?? [];

    for (const card of hand) {
      const value = rankValue(card.rank);

      if (card.suit === trump && (bestTrump === null || value < bestTrump)) {
        bestTrump = value;
        bestSeat = player.seat;
      }

      if (bestAny === null || value < bestAny) {
        bestAny = value;
        bestAnySeat = player.seat;
      }
    }
  }

  return bestTrump === null ? bestAnySeat : bestSeat;
}

export function nextActiveSeat(players: PlayerState[], fromSeat: number): number {
  const count = players.length;

  for (let step = 1; step <= count; step++) {
    const seat = (fromSeat + step) % count;
    const player = players.find((item) => item.seat === seat);

    if (player && !player.isOut) {
      return seat;
    }
  }

  return fromSeat;
}

export function createGame(input: CreateGameInput): GameState {
  const { tableId, settings, userIds, randomInt } = input;

  const deck = shuffle(buildDeck(settings.deckSize), randomInt);

  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: HAND_SIZE,
    isOut: false,
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

  const attackerSeat = settings.isClassic ? findFirstAttackerSeat(hands, players, trump) : 0;
  const defenderSeat = nextActiveSeat(players, attackerSeat);
  const defenderId = players.find((player) => player.seat === defenderSeat)?.userId;
  const defenderHandSize = defenderId ? (hands[defenderId]?.length ?? 0) : 0;

  return {
    tableId,
    settings,
    phase: 'bout',
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
    attackLimit: computeAttackLimit(defenderHandSize),
    passedSeats: [],
    shownTrumpSeats: [],
    turnDeadline: null,
    version: 0,
    loserUserId: null,
    isDraw: false
  };
}
