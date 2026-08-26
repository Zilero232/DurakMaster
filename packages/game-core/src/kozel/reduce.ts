import type {
  Card,
  GameErrorCode,
  KozelAction,
  KozelState,
  PlayerState
} from '@durak-master/schemas';

import { KOZEL_TRICKS_PER_DEAL } from '@durak-master/schemas';

import { cardsEqual } from '../shared';
import { effectiveSuit, isTrump, legalCards, trickWinnerIndex } from './rules';
import { otherTeam, scoreDeal, teamOfSeat } from './scoring';
import { KOZEL_SEATS } from './setup';

export type KozelReduceResult =
  { ok: false; error: GameErrorCode } | { ok: true; state: KozelState };

const fail = (error: GameErrorCode): KozelReduceResult => ({ ok: false, error });

const seatOf = (state: KozelState, userId: string): number | null =>
  state.players.find((player) => player.userId === userId)?.seat ?? null;

const userIdAtSeat = (state: KozelState, seat: number): string | null =>
  state.players.find((player) => player.seat === seat)?.userId ?? null;

const removeCard = (hand: readonly Card[], card: Card): Card[] | null => {
  const index = hand.findIndex((item) => cardsEqual(item, card));

  if (index === -1) {
    return null;
  }

  const rest = [...hand];

  rest.splice(index, 1);

  return rest;
};

const withHandCounts = (state: KozelState, hands: Record<string, Card[]>): PlayerState[] =>
  state.players.map((player) => ({
    ...player,
    handCount: hands[player.userId]?.length ?? 0
  }));

/**
 * Applies the finished deal to the scoreboard and decides whether the game is
 * over. A "lyusya" resets the opponent instead of paying pairs, so a team's
 * count is not monotonic and the target check has to run on the fresh values.
 */
const finishDeal = (state: KozelState, hands: Record<string, Card[]>): KozelState => {
  const seatByUserId: Record<string, number> = {};

  for (const player of state.players) {
    seatByUserId[player.userId] = player.seat;
  }

  const outcome = scoreDeal({
    wonCards: state.wonCards,
    tricksWon: state.tricksWon,
    seatByUserId
  });

  const pairs: [number, number] = [
    state.pairs[0] + outcome.pairsGained[0],
    state.pairs[1] + outcome.pairsGained[1]
  ];

  if (outcome.resetTeam !== null) {
    pairs[outcome.resetTeam] = 0;
  }

  const { targetPairs } = state.rules;
  const winningTeam = pairs.findIndex((value) => value >= targetPairs);

  return {
    ...state,
    hands,
    players: withHandCounts(state, hands),
    pairs,
    hadEggs: state.hadEggs || outcome.hadEggs,
    lastDealPoints: outcome.points,
    // The cards are spent. Either the game is over, or the host deals again
    // through `startNextDeal` — the reducer has no randomness to do it itself.
    isDealComplete: winningTeam === -1,
    phase: winningTeam === -1 ? 'playing' : 'finished',
    loserTeam: winningTeam === -1 ? null : otherTeam(winningTeam as 0 | 1),
    trick: [],
    turnDeadline: null,
    version: state.version + 1
  };
};

/** Awards the finished trick and hands the lead to whoever took it. */
const closeTrick = (state: KozelState, hands: Record<string, Card[]>): KozelState => {
  const cards = state.trick.map((entry) => entry.card);
  const winnerIndex = trickWinnerIndex(cards, state.rules);
  const winnerSeat = state.trick[winnerIndex]?.seat ?? state.leadSeat;
  const winnerUserId = userIdAtSeat(state, winnerSeat);

  if (!winnerUserId) {
    return state;
  }

  const wonCards = {
    ...state.wonCards,
    [winnerUserId]: [...(state.wonCards[winnerUserId] ?? []), ...cards]
  };

  const tricksWon = {
    ...state.tricksWon,
    [winnerUserId]: (state.tricksWon[winnerUserId] ?? 0) + 1
  };

  const trickNumber = state.trickNumber + 1;
  const settled: KozelState = {
    ...state,
    hands,
    wonCards,
    tricksWon,
    trick: [],
    trickNumber,
    leadSeat: winnerSeat,
    activeSeat: winnerSeat,
    players: withHandCounts(state, hands),
    version: state.version + 1
  };

  if (trickNumber < KOZEL_TRICKS_PER_DEAL) {
    return settled;
  }

  return finishDeal(settled, hands);
};

const playCard = (state: KozelState, userId: string, card: Card): KozelReduceResult => {
  const seat = seatOf(state, userId);

  if (seat === null) {
    return fail('NOT_IN_GAME');
  }

  if (state.phase !== 'playing') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (state.activeSeat !== seat) {
    return fail('NOT_YOUR_TURN');
  }

  const hand = state.hands[userId] ?? [];
  const rest = removeCard(hand, card);

  if (!rest) {
    return fail('CARD_NOT_IN_HAND');
  }

  const trickCards = state.trick.map((entry) => entry.card);
  const allowed = legalCards({
    hand,
    trick: trickCards,
    rules: state.rules,
    isFirstTrick: state.trickNumber === 0,
    unledSuits: new Set(state.unledSuits)
  });

  if (!allowed.some((legal) => cardsEqual(legal, card))) {
    // Leading a trump into the opening trick is its own mistake; everything else
    // that reaches here is a failure to follow the led suit.
    return fail(state.trick.length === 0 ? 'MUST_LEAD_PLAIN_SUIT' : 'MUST_FOLLOW_SUIT');
  }

  const hands = { ...state.hands, [userId]: rest };
  const trick = [...state.trick, { seat, card }];

  // A plain lead marks its suit as seen — the ace-discard restriction reads this.
  const unledSuits =
    state.trick.length === 0 && !isTrump(card)
      ? state.unledSuits.filter((suit) => suit !== effectiveSuit(card))
      : state.unledSuits;

  const played: KozelState = { ...state, hands, trick, unledSuits };

  if (trick.length === KOZEL_SEATS) {
    return { ok: true, state: closeTrick(played, hands) };
  }

  return {
    ok: true,
    state: {
      ...played,
      activeSeat: (seat + 1) % KOZEL_SEATS,
      players: withHandCounts(played, hands),
      version: state.version + 1
    }
  };
};

/**
 * The winning team names which of its two players opens the deal — a real step,
 * taken after the cards are seen, not something the server can decide alone.
 */
const chooseLeader = (state: KozelState, userId: string, seat: number): KozelReduceResult => {
  const actorSeat = seatOf(state, userId);

  if (actorSeat === null) {
    return fail('NOT_IN_GAME');
  }

  if (state.phase !== 'chooseLeader') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const choosingTeam = teamOfSeat(state.leadSeat);

  if (teamOfSeat(actorSeat) !== choosingTeam || teamOfSeat(seat) !== choosingTeam) {
    return fail('NOT_YOUR_TEAM');
  }

  return {
    ok: true,
    state: {
      ...state,
      phase: 'playing',
      leadSeat: seat,
      activeSeat: seat,
      version: state.version + 1
    }
  };
};

export function reduce(state: KozelState, userId: string, action: KozelAction): KozelReduceResult {
  switch (action.type) {
    case 'play': {
      return playCard(state, userId, action.card);
    }

    case 'chooseLeader': {
      return chooseLeader(state, userId, action.seat);
    }

    default: {
      // `exchangeLastTrump` needs the rule enabled; it is off by default and the
      // sources describe it too loosely to run without one.
      return fail('INVALID_ACTION_FOR_PHASE');
    }
  }
}
