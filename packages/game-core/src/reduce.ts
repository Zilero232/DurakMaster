import { beats } from './deck';
import {
  canThrowIn,
  canTransfer,
  collectTableCards,
  computeAttackLimit,
  handContains,
  hasDefendedCards,
  hasUndefendedCards,
  isLegalAttackCard,
  removeCard,
} from './rules';
import { nextActiveSeat } from './setup';

import type {
  Card,
  GameAction,
  GameErrorCode,
  GameState,
  PlayerState,
} from '@durak-master/schemas';

export type ReduceResult = { ok: true; state: GameState } | { ok: false; error: GameErrorCode };

const HAND_SIZE = 6;

const fail = (error: GameErrorCode): ReduceResult => ({ ok: false, error });

const seatOf = (state: GameState, userId: string): number | null =>
  state.players.find((player) => player.userId === userId)?.seat ?? null;

const playerAtSeat = (state: GameState, seat: number): PlayerState | undefined =>
  state.players.find((player) => player.seat === seat);

const handSizeAtSeat = (state: GameState, seat: number): number => {
  const player = playerAtSeat(state, seat);

  return player ? (state.hands[player.userId]?.length ?? 0) : 0;
};

/** Синхронизирует публичные счётчики карт с реальными руками. */
const syncHandCounts = (state: GameState): GameState => ({
  ...state,
  players: state.players.map((player) => ({
    ...player,
    handCount: state.hands[player.userId]?.length ?? 0,
  })),
});

/**
 * Применяет действие игрока к состоянию.
 *
 * Чистая функция: вход не мутируется, результат детерминирован.
 * Вся валидация происходит здесь — сервер не должен дублировать проверки,
 * а клиент не должен на них полагаться.
 */
export function reduce(state: GameState, userId: string, action: GameAction): ReduceResult {
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

// ---------------------------------------------------------------------------
// Атака и подкидывание
// ---------------------------------------------------------------------------

function applyAttack(state: GameState, seat: number, userId: string, card: Card): ReduceResult {
  // Защищающийся не подкидывает; при режиме «соседи» подкидывать вправе
  // только соседи защищающегося.
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

  const next: GameState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table: [...state.table, { attack: card, defense: null }],
    // Новая карта — все прежние пасы аннулируются: подкинуть могут снова.
    passedSeats: [],
    activeSeat: state.defenderSeat,
    version: state.version + 1,
  };

  return { ok: true, state: syncHandCounts(next) };
}

// ---------------------------------------------------------------------------
// Защита
// ---------------------------------------------------------------------------

function applyDefend(
  state: GameState,
  seat: number,
  userId: string,
  pairIndex: number,
  card: Card,
): ReduceResult {
  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.phase === 'taking') {
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
    index === pairIndex ? { ...item, defense: card } : item,
  );

  const next: GameState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table,
    // Отбитая карта открывает новый ранг — атакующие снова могут подкинуть.
    passedSeats: [],
    activeSeat: state.attackerSeat,
    version: state.version + 1,
  };

  return { ok: true, state: syncHandCounts(next) };
}

// ---------------------------------------------------------------------------
// Перевод
// ---------------------------------------------------------------------------

function applyTransfer(state: GameState, seat: number, userId: string, card: Card): ReduceResult {
  if (state.settings.mode !== 'transfer') {
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
    // Различаем причину: несовпадение ранга или нехватка карт у цели.
    const tableRank = state.table[0]?.attack.rank;

    if (tableRank !== undefined && card.rank !== tableRank) {
      return fail('TRANSFER_RANK_MISMATCH');
    }

    return fail('TRANSFER_TARGET_HAS_TOO_FEW_CARDS');
  }

  const table = [...state.table, { attack: card, defense: null }];

  const next: GameState = {
    ...state,
    hands: { ...state.hands, [userId]: removeCard(hand, card) },
    table,
    // Бывший защищающийся становится атакующим, атака идёт дальше по кругу.
    attackerSeat: state.defenderSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextDefenderSeat,
    attackLimit: computeAttackLimit(nextDefenderHandSize),
    passedSeats: [],
    version: state.version + 1,
  };

  return { ok: true, state: syncHandCounts(next) };
}

/**
 * Перевод показом козыря: защищающийся показывает козырь того же ранга,
 * что и карты на столе, и оставляет его в руке.
 *
 * Отличия от обычного перевода: карта не покидает руку, поэтому на столе
 * не прибавляется атакующих карт, а «достаточность» проверяется по уже
 * лежащим картам — новому защищающемуся отбивать ровно их.
 */
function applyTransferByShowing(
  state: GameState,
  seat: number,
  userId: string,
  card: Card,
): ReduceResult {
  if (state.settings.mode !== 'transfer' || !state.settings.allowTransferByShowingTrump) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.phase === 'taking') {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  if (hasDefendedCards(state.table)) {
    return fail('TRANSFER_AFTER_DEFENSE');
  }

  // Показ разрешён один раз за партию: дальше козырь надо выкладывать.
  if (state.shownTrumpSeats.includes(seat)) {
    return fail('TRANSFER_NOT_ALLOWED');
  }

  // Показывают именно козырь — некозырной картой перевод только выкладыванием.
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

  // Карта остаётся в руке, поэтому отбивать придётся уже лежащие карты.
  if (state.table.length > nextDefenderHandSize) {
    return fail('TRANSFER_TARGET_HAS_TOO_FEW_CARDS');
  }

  const next: GameState = {
    ...state,
    attackerSeat: state.defenderSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextDefenderSeat,
    attackLimit: computeAttackLimit(nextDefenderHandSize),
    passedSeats: [],
    shownTrumpSeats: [...state.shownTrumpSeats, seat],
    version: state.version + 1,
  };

  return { ok: true, state: syncHandCounts(next) };
}

// ---------------------------------------------------------------------------
// Взятие
// ---------------------------------------------------------------------------

function applyTake(state: GameState, seat: number): ReduceResult {
  if (seat !== state.defenderSeat) {
    return fail('NOT_YOUR_TURN');
  }

  if (state.table.length === 0) {
    return fail('NOTHING_TO_TAKE');
  }

  // Взятие не мгновенно: атакующие ещё могут подкинуть в пределах лимита.
  const next: GameState = {
    ...state,
    phase: 'taking',
    activeSeat: state.attackerSeat,
    passedSeats: [],
    version: state.version + 1,
  };

  return { ok: true, state: next };
}

// ---------------------------------------------------------------------------
// Пас / бито
// ---------------------------------------------------------------------------

function applyPass(state: GameState, seat: number): ReduceResult {
  if (seat === state.defenderSeat) {
    return fail('CANNOT_PASS_AS_DEFENDER');
  }

  if (state.table.length === 0) {
    return fail('INVALID_ACTION_FOR_PHASE');
  }

  const passedSeats = state.passedSeats.includes(seat)
    ? state.passedSeats
    : [...state.passedSeats, seat];

  // Ждём паса только от тех, кто вправе подкидывать: при режиме «соседи»
  // остальные в отбое не участвуют и блокировать его не должны.
  const attackers = state.players.filter((item) => canThrowIn(item.seat, state));
  const everyonePassed = attackers.every((item) => passedSeats.includes(item.seat));

  if (!everyonePassed) {
    return {
      ok: true,
      state: { ...state, passedSeats, activeSeat: state.attackerSeat, version: state.version + 1 },
    };
  }

  // Все спасовали — отбой завершается.
  if (state.phase === 'taking') {
    return { ok: true, state: finishBout(state, { defenderTook: true }) };
  }

  if (hasUndefendedCards(state.table)) {
    // Есть неотбитые карты, а атакующие пасуют — защищающийся ещё не закончил.
    return {
      ok: true,
      state: { ...state, passedSeats, activeSeat: state.defenderSeat, version: state.version + 1 },
    };
  }

  return { ok: true, state: finishBout(state, { defenderTook: false }) };
}

// ---------------------------------------------------------------------------
// Завершение отбоя: сброс/взятие, добор, смена ролей, проверка конца партии
// ---------------------------------------------------------------------------

type FinishBoutOptions = { defenderTook: boolean };

function finishBout(state: GameState, options: FinishBoutOptions): GameState {
  const defender = playerAtSeat(state, state.defenderSeat);
  const hands = { ...state.hands };
  let discard = state.discard;

  if (options.defenderTook && defender) {
    hands[defender.userId] = [...(hands[defender.userId] ?? []), ...collectTableCards(state.table)];
  } else {
    discard = [...discard, ...collectTableCards(state.table)];
  }

  // Добор строго по порядку: атакующий → остальные по часовой → защищающийся последним.
  //
  // Раздаём по кругу, а не «каждому сразу до шести»: когда карт в колоде
  // меньше, чем нужно всем, порядок определяет, кому достанутся остатки.
  // Выдача одному игроку всей колоды оставила бы следующих ни с чем —
  // на последних картах это решало бы исход партии.
  const talon = [...state.talon];
  const drawOrder = buildDrawOrder(state)
    .map((drawSeat) => playerAtSeat(state, drawSeat))
    .filter((drawPlayer): drawPlayer is PlayerState => drawPlayer !== undefined);

  // Руки копируем: вход мутировать нельзя.
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

      // Добор с конца: козырная карта лежит первой и уходит последней.
      const drawn = talon.pop();

      if (drawn) {
        hand.push(drawn);
      }
    }
  }

  // Выбывают только при пустой колоде.
  const players = state.players.map((item) => ({
    ...item,
    handCount: hands[item.userId]?.length ?? 0,
    isOut: talon.length === 0 && (hands[item.userId]?.length ?? 0) === 0,
  }));

  const active = players.filter((item) => !item.isOut);

  const base: GameState = {
    ...state,
    hands,
    talon,
    discard,
    players,
    table: [],
    passedSeats: [],
    turnDeadline: null,
    version: state.version + 1,
  };

  // Ничья: колода пуста и ни у кого не осталось карт.
  if (active.length === 0) {
    return {
      ...base,
      phase: 'finished',
      isDraw: state.settings.allowDraw,
      loserUserId: null,
      trumpCard: talon.length > 0 ? base.trumpCard : null,
    };
  }

  if (active.length === 1) {
    const loser = active[0];

    return {
      ...base,
      phase: 'finished',
      isDraw: false,
      loserUserId: loser?.userId ?? null,
      trumpCard: talon.length > 0 ? base.trumpCard : null,
    };
  }

  // Роли на следующий отбой.
  // Отбились — атакует бывший защищающийся. Взял — ход к игроку ПОСЛЕ него.
  const nextAttackerSeat = options.defenderTook
    ? nextActiveSeat(players, state.defenderSeat)
    : firstActiveFrom(players, state.defenderSeat);
  const nextDefenderSeat = nextActiveSeat(players, nextAttackerSeat);

  return {
    ...base,
    phase: 'bout',
    attackerSeat: nextAttackerSeat,
    defenderSeat: nextDefenderSeat,
    activeSeat: nextAttackerSeat,
    attackLimit: computeAttackLimit(
      players.find((item) => item.seat === nextDefenderSeat)?.handCount ?? HAND_SIZE,
    ),
    trumpCard: talon.length > 0 ? base.trumpCard : null,
  };
}

/** Само это место, если игрок активен; иначе следующее активное. */
function firstActiveFrom(players: PlayerState[], seat: number): number {
  const player = players.find((item) => item.seat === seat);

  if (player && !player.isOut) {
    return seat;
  }

  return nextActiveSeat(players, seat);
}

/** Порядок добора: атакующий → подкидывавшие по часовой → защищающийся. */
function buildDrawOrder(state: GameState): number[] {
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
