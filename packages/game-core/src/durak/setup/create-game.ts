import type { Card, DurakState, PlayerState } from '@durak-master/schemas';

import { DURAK_HAND_SIZE, isJoker } from '@durak-master/schemas';

import type { CreateGameInput } from '../../module';

import { buildDeck, nextActiveSeat, shuffle } from '../../shared';
import { computeAttackLimit } from '../rules';
import { findFirstAttackerSeat } from './seats';

function lastOrdinaryCardIndex(deck: Card[]): number {
  for (let index = deck.length - 1; index >= 0; index--) {
    const card = deck[index];

    if (card && !isJoker(card)) {
      return index;
    }
  }

  return -1;
}

function keepJokerOffTheBottom(deck: Card[]): Card[] {
  const bottom = deck[deck.length - 1];

  if (!bottom || !isJoker(bottom)) {
    return deck;
  }

  const swapIndex = lastOrdinaryCardIndex(deck);

  if (swapIndex === -1) {
    return deck;
  }

  const swapped = [...deck];

  swapped[deck.length - 1] = deck[swapIndex] as Card;
  swapped[swapIndex] = bottom;

  return swapped;
}

export function createGame(input: CreateGameInput<'durak'>): DurakState {
  const { tableId, settings, userIds, randomInt } = input;
  const { rules } = settings;

  const deck = keepJokerOffTheBottom(
    shuffle(buildDeck(rules.deckSize, rules.withJokers), randomInt)
  );

  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: DURAK_HAND_SIZE,
    isOut: false,
    outPlace: null,
    isDisconnected: false
  }));

  const hands: Record<string, Card[]> = {};
  let cursor = 0;

  for (const player of players) {
    hands[player.userId] = deck.slice(cursor, cursor + DURAK_HAND_SIZE);
    cursor += DURAK_HAND_SIZE;
  }

  const rest = deck.slice(cursor);
  const bottomCard = rest.at(-1) ?? deck.at(-1);
  const trumpCard = bottomCard && !isJoker(bottomCard) ? bottomCard : null;
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
