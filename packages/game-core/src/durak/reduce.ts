import type {
  Card,
  DurakAction,
  DurakState,
  GameErrorCode,
  PlayerState
} from '@durak-master/schemas';

import {
  beats,
  canThrowIn,
  canTransfer,
  collectTableCards,
  computeAttackLimit,
  handContains,
  hasDefendedCards,
  hasUndefendedCards,
  isLegalAttackCard,
  removeCard
} from './rules';
import { nextActiveSeat } from './setup';

export type DurakReduceResult =
  { ok: false; error: GameErrorCode } | { ok: true; state: DurakState };

const HAND_SIZE = 6;

function fail(error: GameErrorCode): DurakReduceResult {
  return { ok: false, error };
}

function seatOf(state: DurakState, userId: string): number | null {
  return state.players.find((player) => player.userId === userId)?.seat ?? null;
}

function playerAtSeat(state: DurakState, seat: number): PlayerState | undefined {
  return state.players.find((player) => player.seat === seat);
}

function handSizeAtSeat(state: DurakState, seat: number): number {
  const player = playerAtSeat(state, seat);

  return player ? (state.hands[player.userId]?.length ?? 0) : 0;
}

function syncHandCounts(state: DurakState): DurakState {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      handCount: state.hands[player.userId]?.length ?? 0
    }))
  };
}

export function reduce(state: DurakState, userId: string, action: DurakAction): DurakReduceResult {
  if (state.phase === 'finished') {
    return fail('GAME_NOT_ACTIVE');
  }

  const seat = seatOf(state, userId);

  if (seat === null) {
    return fail('NOT_IN_GAME');
  }

  const player = playerAtSeat(state, seat);

  if (!player || player.isOut) {
    return fail('NOT_IN_GAME');
  }

  switch (action.type) {
    case 'attack':
      return applyAttack(state, seat, userId, action.card);
    case 'defend':
      return applyDefend(state, seat, userId, action.pairIndex, action.card);
    case 'transfer':
      return applyTransfer(state, seat, userId, action.card);
    case 'transferByShowing':
      return applyTransferByShowing(state, seat, userId, action.card);
    case 'take':
      return applyTake(state, seat);
    case 'pass':
      return applyPass(state, seat);
    default:
      return fail('INVALID_ACTION_FOR_PHASE');
  }
}

function applyAttack(
  state: DurakState,
  seat: number,
  userId: string,
  card: Card
): DurakReduceResult {
  if (!canThrowIn(seat, state)) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const hand = state.hands[userId] ?? [];

  if (!handContains(hand, card)) {
    return fail('CARD_NOT_IN_HAND');
  }

  if (state.table.length >= state.attackLimit) {
    return fail('ATTACK_LIMIT_REACHED');
  }

  if (!isLegalAttackCard(card, state.table, state.attackLimit)) {
    return fail('RANK_NOT_ON_TABLE');
  }

  const next: DurakState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table: [...state.table, { attack: card, defense: null }],
    passedSeats: [],
    activeSeat: state.defenderSeat,
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}

function applyDefend(
  state: DurakState,
  seat: number,
  userId: string,
  pairIndex: number,
  card: Card
): DurakReduceResult {
  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.isTaking) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const pair = state.table[pairIndex];

  if (!pair) {
    return fail('PAIR_NOT_FOUND');
  }

  if (pair.defense !== null) {
    return fail('PAIR_ALREADY_DEFENDED');
  }

  const hand = state.hands[userId] ?? [];

  if (!handContains(hand, card)) {
    return fail('CARD_NOT_IN_HAND');
  }

  if (!beats(card, pair.attack, state.trump)) {
    return fail('CANNOT_BEAT_CARD');
  }

  const table = state.table.map((item, index) =>
    index === pairIndex ? { ...item, defense: card } : item
  );

  const next: DurakState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table,
    passedSeats: [],
    activeSeat: state.attackerSeat,
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}

function applyTransfer(
  state: DurakState,
  seat: number,
  userId: string,
  card: Card
): DurakReduceResult {
  if (state.rules.mode !== 'transfer') {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (hasDefendedCards(state.table)) {
    return fail('TRANSFER_AFTER_DEFENSE');
  }

  const hand = state.hands[userId] ?? [];

  if (!handContains(hand, card)) {
    return fail('CARD_NOT_IN_HAND');
  }

  const nextDefenderSeat = nextActiveSeat(state.players, state.defenderSeat);
  const nextDefenderHandSize = handSizeAtSeat(state, nextDefenderSeat);

  if (!canTransfer(card, state.table, nextDefenderHandSize)) {
    const tableRank = state.table[0]?.attack.rank;

    if (tableRank !== undefined && card.rank !== tableRank) {
      return fail('TRANSFER_RANK_MISMATCH');
    }

    return fail('TRANSFER_TARGET_HAS_TOO_FEW_CARDS');
  }

  const table = [...state.table, { attack: card, defense: null }];

  const next: DurakState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table,
    attackerSeat: state.defenderSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextDefenderSeat,
    attackLimit: computeAttackLimit(state.rules.attackLimit, nextDefenderHandSize),
    passedSeats: [],
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}

function applyTransferByShowing(
  state: DurakState,
  seat: number,
  userId: string,
  card: Card
): DurakReduceResult {
  if (state.rules.mode !== 'transfer' || !state.rules.allowTransferByShowingTrump) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.isTaking) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (hasDefendedCards(state.table)) {
    return fail('TRANSFER_AFTER_DEFENSE');
  }

  if (state.shownTrumpSeats.includes(seat)) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (card.suit !== state.trump) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  const hand = state.hands[userId] ?? [];

  if (!handContains(hand, card)) {
    return fail('CARD_NOT_IN_HAND');
  }

  const tableRank = state.table[0]?.attack.rank;

  if (tableRank === undefined) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (card.rank !== tableRank || !state.table.every((pair) => pair.attack.rank === tableRank)) {
    return fail('TRANSFER_RANK_MISMATCH');
  }

  const nextDefenderSeat = nextActiveSeat(state.players, state.defenderSeat);
  const nextDefenderHandSize = handSizeAtSeat(state, nextDefenderSeat);

  if (state.table.length > nextDefenderHandSize) {
    return fail('TRANSFER_TARGET_HAS_TOO_FEW_CARDS');
  }

  const next: DurakState = {
    ...state,
    attackerSeat: state.defenderSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextDefenderSeat,
    attackLimit: computeAttackLimit(state.rules.attackLimit, nextDefenderHandSize),
    passedSeats: [],
    shownTrumpSeats: [...state.shownTrumpSeats, seat],
    version: state.version + 1
  };

  return { ok: true, state: syncHandCounts(next) };
}

function applyTake(state: DurakState, seat: number): DurakReduceResult {
  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.table.length === 0) {
    return fail('NOTHING_TO_TAKE');
  }

  const next: DurakState = {
    ...state,
    isTaking: true,
    activeSeat: state.attackerSeat,
    passedSeats: [],
    version: state.version + 1
  };

  return { ok: true, state: next };
}

function applyPass(state: DurakState, seat: number): DurakReduceResult {
  if (seat === state.defenderSeat) {
    return fail('CANNOT_PASS_AS_DEFENDER');
  }

  if (state.table.length === 0) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const passedSeats = state.passedSeats.includes(seat)
    ? state.passedSeats
    : [...state.passedSeats, seat];

  const attackers = state.players.filter((item) => canThrowIn(item.seat, state));
  const everyonePassed = attackers.every((item) => passedSeats.includes(item.seat));

  if (!everyonePassed) {
    return {
      ok: true,
      state: { ...state, passedSeats, activeSeat: state.attackerSeat, version: state.version + 1 }
    };
  }

  if (state.isTaking) {
    return { ok: true, state: finishBout(state, { defenderTook: true }) };
  }

  if (hasUndefendedCards(state.table)) {
    return {
      ok: true,
      state: { ...state, passedSeats, activeSeat: state.defenderSeat, version: state.version + 1 }
    };
  }

  return { ok: true, state: finishBout(state, { defenderTook: false }) };
}

type FinishBoutOptions = { defenderTook: boolean };

function finishBout(state: DurakState, options: FinishBoutOptions): DurakState {
  const defender = playerAtSeat(state, state.defenderSeat);
  const hands = { ...state.hands };
  let discard = state.discard;

  if (options.defenderTook && defender) {
    hands[defender.userId] = [...(hands[defender.userId] ?? []), ...collectTableCards(state.table)];
  } else {
    discard = [...discard, ...collectTableCards(state.table)];
  }

  const talon = [...state.talon];
  const drawOrder = buildDrawOrder(state)
    .map((drawSeat) => playerAtSeat(state, drawSeat))
    .filter((drawPlayer): drawPlayer is PlayerState => drawPlayer !== undefined);

  for (const drawPlayer of drawOrder) {
    hands[drawPlayer.userId] = [...(hands[drawPlayer.userId] ?? [])];
  }

  for (let round = 0; round < HAND_SIZE && talon.length > 0; round++) {
    for (const drawPlayer of drawOrder) {
      if (talon.length === 0) {
        break;
      }

      const hand = hands[drawPlayer.userId] ?? [];

      if (hand.length >= HAND_SIZE) {
        continue;
      }

      const drawn = talon.pop();

      if (drawn) {
        hand.push(drawn);
      }
    }
  }

  const players = state.players.map((item) => ({
    ...item,
    handCount: hands[item.userId]?.length ?? 0,
    isOut: talon.length === 0 && (hands[item.userId]?.length ?? 0) === 0
  }));

  const active = players.filter((item) => !item.isOut);

  const base: DurakState = {
    ...state,
    hands,
    talon,
    discard,
    players,
    table: [],
    passedSeats: [],
    turnDeadline: null,
    version: state.version + 1
  };

  if (active.length === 0) {
    const lastDefender = state.players.find((player) => player.seat === state.defenderSeat);

    return {
      ...base,
      phase: 'finished',
      isTaking: false,
      isDraw: state.rules.allowDraw,
      loserUserId: state.rules.allowDraw ? null : (lastDefender?.userId ?? null),
      trumpCard: talon.length > 0 ? base.trumpCard : null
    };
  }

  if (active.length === 1) {
    const loser = active[0];

    return {
      ...base,
      phase: 'finished',
      isTaking: false,
      isDraw: false,
      loserUserId: loser?.userId ?? null,
      trumpCard: talon.length > 0 ? base.trumpCard : null
    };
  }

  const nextAttackerSeat = options.defenderTook
    ? nextActiveSeat(players, state.defenderSeat)
    : firstActiveFrom(players, state.defenderSeat);
  const nextDefenderSeat = nextActiveSeat(players, nextAttackerSeat);

  return {
    ...base,
    phase: 'playing',
    isTaking: false,
    attackerSeat: nextAttackerSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextAttackerSeat,
    attackLimit: computeAttackLimit(
      state.rules.attackLimit,
      players.find((item) => item.seat === nextDefenderSeat)?.handCount ?? HAND_SIZE
    ),
    trumpCard: talon.length > 0 ? base.trumpCard : null
  };
}

function firstActiveFrom(players: PlayerState[], seat: number): number {
  const player = players.find((item) => item.seat === seat);

  if (player && !player.isOut) {
    return seat;
  }

  return nextActiveSeat(players, seat);
}

function buildDrawOrder(state: DurakState): number[] {
  const order: number[] = [state.attackerSeat];
  const count = state.players.length;

  for (let step = 1; step < count; step++) {
    const seat = (state.attackerSeat + step) % count;

    if (seat !== state.defenderSeat) {
      order.push(seat);
    }
  }

  order.push(state.defenderSeat);

  return order;
}
