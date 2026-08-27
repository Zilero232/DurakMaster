import type {
  BurkozelAction,
  BurkozelState,
  Card,
  GameErrorCode,
  PlayerState
} from '@durak-master/schemas';

import { BURKOZEL_HAND_SIZE } from '@durak-master/schemas';

import { cardsEqual } from '../shared';
import { isLegalLead, setBeatsSet } from './rules';
import { scoreDeal } from './scoring';

export type BurkozelReduceResult =
  { ok: false; error: GameErrorCode } | { ok: true; state: BurkozelState };

function fail(error: GameErrorCode): BurkozelReduceResult {
  return { ok: false, error };
}

function seatOf(state: BurkozelState, userId: string): number | null {
  return state.players.find((player) => player.userId === userId)?.seat ?? null;
}

function userIdAtSeat(state: BurkozelState, seat: number): string | null {
  return state.players.find((player) => player.seat === seat)?.userId ?? null;
}

function nextSeat(players: PlayerState[], fromSeat: number): number {
  return (fromSeat + 1) % players.length;
}

function removeCards(hand: readonly Card[], cards: readonly Card[]): Card[] | null {
  const rest = [...hand];

  for (const card of cards) {
    const index = rest.findIndex((item) => cardsEqual(item, card));

    if (index === -1) {
      return null;
    }

    rest.splice(index, 1);
  }

  return rest;
}

function withHandCounts(state: BurkozelState, hands: Record<string, Card[]>): PlayerState[] {
  return state.players.map((player) => ({
    ...player,
    handCount: hands[player.userId]?.length ?? 0
  }));
}

function drawOrder(state: BurkozelState, takerSeat: number): PlayerState[] {
  const count = state.players.length;
  const ordered: PlayerState[] = [];

  for (let step = 0; step < count; step++) {
    const seat = (takerSeat + step) % count;
    const player = state.players.find((item) => item.seat === seat);

    if (player) {
      ordered.push(player);
    }
  }

  return ordered;
}

function refill(
  state: BurkozelState,
  hands: Record<string, Card[]>,
  takerSeat: number
): { hands: Record<string, Card[]>; talon: Card[] } {
  const talon = [...state.talon];
  const order = drawOrder(state, takerSeat);
  const next: Record<string, Card[]> = { ...hands };

  let drew = true;

  while (drew && talon.length > 0) {
    drew = false;

    for (const player of order) {
      const hand = next[player.userId] ?? [];

      if (hand.length >= BURKOZEL_HAND_SIZE || talon.length === 0) {
        continue;
      }

      const card = talon.shift();

      if (card) {
        next[player.userId] = [...hand, card];
        drew = true;
      }
    }
  }

  return { hands: next, talon };
}

function finishDeal(state: BurkozelState, hands: Record<string, Card[]>): BurkozelState {
  const outcome = scoreDeal(state);
  const penalties: Record<string, number> = {};

  for (const player of state.players) {
    penalties[player.userId] =
      (state.penalties[player.userId] ?? 0) + (outcome.penalties[player.userId] ?? 0);
  }

  const worst = state.players.reduce<PlayerState | null>((current, player) => {
    if (!current) {
      return player;
    }

    return (penalties[player.userId] ?? 0) > (penalties[current.userId] ?? 0) ? player : current;
  }, null);

  const reachedLimit = state.players.filter(
    (player) => (penalties[player.userId] ?? 0) >= state.rules.penaltyLimit
  );

  const isDraw = reachedLimit.length === 0;

  return {
    ...state,
    hands,
    players: withHandCounts(state, hands),
    phase: isDraw ? 'playing' : 'finished',
    penalties,
    turnDeadline: null,
    version: state.version + 1,
    loserUserId: isDraw ? null : (worst?.userId ?? null),
    isDraw: false
  };
}

function resolveTrick(state: BurkozelState, hands: Record<string, Card[]>): BurkozelState {
  const bestPlay = state.bestPlayIndex === null ? null : state.trick[state.bestPlayIndex];
  const takerSeat = bestPlay?.seat ?? state.leadSeat;
  const takerId = userIdAtSeat(state, takerSeat);

  if (!takerId) {
    return state;
  }

  const taken = state.trick.flatMap((play) => play.cards);
  const wonCards: Record<string, Card[]> = {
    ...state.wonCards,
    [takerId]: [...(state.wonCards[takerId] ?? []), ...taken]
  };
  const tricksWon: Record<string, number> = {
    ...state.tricksWon,
    [takerId]: (state.tricksWon[takerId] ?? 0) + 1
  };

  const refilled = refill(state, hands, takerSeat);
  const isDealOver = Object.values(refilled.hands).every((hand) => hand.length === 0);

  const settled: BurkozelState = {
    ...state,
    wonCards,
    tricksWon,
    talon: refilled.talon,
    trick: [],
    bestPlayIndex: null,
    leadSeat: takerSeat,
    activeSeat: takerSeat
  };

  if (isDealOver) {
    return finishDeal(settled, refilled.hands);
  }

  return {
    ...settled,
    hands: refilled.hands,
    players: withHandCounts(settled, refilled.hands),
    turnDeadline: null,
    version: state.version + 1
  };
}

function playCards(
  state: BurkozelState,
  userId: string,
  seat: number,
  cards: readonly Card[]
): BurkozelReduceResult {
  const hand = state.hands[userId] ?? [];
  const rest = removeCards(hand, cards);

  if (!rest) {
    return fail('CARD_NOT_IN_HAND');
  }

  const isLead = state.trick.length === 0;

  if (isLead) {
    if (!isLegalLead(cards, state.rules)) {
      return fail('MUST_FOLLOW_SUIT');
    }
  } else {
    const required = Math.min(state.trick[0]?.cards.length ?? 0, hand.length);

    if (cards.length !== required) {
      return fail('CARD_COUNT_MISMATCH');
    }
  }

  const best = state.bestPlayIndex === null ? null : state.trick[state.bestPlayIndex];
  const doesBeat =
    !isLead &&
    best !== undefined &&
    best !== null &&
    cards.length === best.cards.length &&
    setBeatsSet(cards, best.cards, state.trump, state.rules);

  const hands: Record<string, Card[]> = { ...state.hands, [userId]: rest };
  const trick = [...state.trick, { seat, cards: [...cards], isFaceUp: isLead || doesBeat }];
  const bestPlayIndex = isLead || doesBeat ? trick.length - 1 : state.bestPlayIndex;

  const played: BurkozelState = {
    ...state,
    hands,
    players: withHandCounts(state, hands),
    trick,
    bestPlayIndex
  };

  if (trick.length === state.players.length) {
    return { ok: true, state: resolveTrick(played, hands) };
  }

  return {
    ok: true,
    state: {
      ...played,
      activeSeat: nextSeat(state.players, seat),
      turnDeadline: null,
      version: state.version + 1
    }
  };
}

export function reduce(
  state: BurkozelState,
  userId: string,
  action: BurkozelAction
): BurkozelReduceResult {
  if (state.phase !== 'playing') {
    return fail('GAME_NOT_ACTIVE');
  }

  const seat = seatOf(state, userId);

  if (seat === null) {
    return fail('NOT_IN_GAME');
  }

  if (seat !== state.activeSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (action.type === 'play') {
    return playCards(state, userId, seat, action.cards);
  }

  return fail('INVALID_ACTION_FOR_PHASE');
}
