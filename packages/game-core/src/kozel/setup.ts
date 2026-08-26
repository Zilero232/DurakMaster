import type { Card, KozelState, PlayerState, SettingsForGame, Suit } from '@durak-master/schemas';

import { KOZEL_HAND_SIZE } from '@durak-master/schemas';

import { buildDeck, cardsEqual, shuffle } from '../shared';
import { teamOfSeat } from './scoring';

export type CreateKozelGameInput = {
  tableId: string;
  settings: SettingsForGame<'kozel'>;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

/** The lowest trump. Its holder opens the very first deal of a game. */
const LOWEST_TRUMP: Card = { rank: 'eight', suit: 'clubs' };

const PLAIN_SUITS: Suit[] = ['spades', 'hearts', 'diamonds'];

export const KOZEL_SEATS = 4;

type DealInput = {
  players: PlayerState[];
  dealerSeat: number;
  randomInt: (maxExclusive: number) => number;
};

type DealResult = {
  hands: Record<string, Card[]>;
  wonCards: Record<string, Card[]>;
  tricksWon: Record<string, number>;
  lowestTrumpSeat: number;
};

/**
 * Deals the whole 32-card deck out: four hands of eight, no talon and no
 * turned-up card. Trump in Kozel is fixed by the rules, not by a deal.
 */
export const dealHands = ({ players, randomInt }: DealInput): DealResult => {
  const deck = shuffle(buildDeck(32), randomInt);

  const hands: Record<string, Card[]> = {};
  const wonCards: Record<string, Card[]> = {};
  const tricksWon: Record<string, number> = {};

  let lowestTrumpSeat = 0;
  let cursor = 0;

  for (const player of players) {
    const hand = deck.slice(cursor, cursor + KOZEL_HAND_SIZE);

    hands[player.userId] = hand;
    wonCards[player.userId] = [];
    tricksWon[player.userId] = 0;
    cursor += KOZEL_HAND_SIZE;

    if (hand.some((card) => cardsEqual(card, LOWEST_TRUMP))) {
      lowestTrumpSeat = player.seat;
    }
  }

  return { hands, wonCards, tricksWon, lowestTrumpSeat };
};

type FirstLeadInput = {
  settings: SettingsForGame<'kozel'>;
  dealerSeat: number;
  lowestTrumpSeat: number;
};

/** Who opens the first deal — by default whoever was dealt the eight of clubs. */
export const firstLeadSeat = ({
  settings,
  dealerSeat,
  lowestTrumpSeat
}: FirstLeadInput): number => {
  switch (settings.rules.firstLead) {
    case 'leftOfDealer': {
      return (dealerSeat + 1) % KOZEL_SEATS;
    }

    case 'dealer': {
      return dealerSeat;
    }

    default: {
      return lowestTrumpSeat;
    }
  }
};

export function createGame(input: CreateKozelGameInput): KozelState {
  const { tableId, settings, userIds, randomInt } = input;
  const { rules } = settings;

  const players: PlayerState[] = userIds.map((userId, index) => ({
    userId,
    seat: index,
    handCount: KOZEL_HAND_SIZE,
    isOut: false,
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
