import type { DurakState, PlayerState } from '@durak-master/schemas';

import { HAND_SIZE } from '../config';
import { collectTableCards, computeAttackLimit } from '../rules';
import { nextActiveSeat } from '../setup';
import { playerAtSeat } from './shared';

export type FinishBoutOptions = { defenderTook: boolean };

export function finishBout(state: DurakState, options: FinishBoutOptions): DurakState {
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

      const drawn = talon.shift();

      if (drawn) {
        hand.push(drawn);
      }
    }
  }

  let nextOutPlace = state.players.filter((item) => item.outPlace !== null).length;

  const players = state.players.map((item) => {
    const handCount = hands[item.userId]?.length ?? 0;
    const isOut = talon.length === 0 && handCount === 0;

    if (!isOut || item.outPlace !== null) {
      return { ...item, handCount, isOut };
    }

    nextOutPlace += 1;

    return { ...item, handCount, isOut, outPlace: nextOutPlace };
  });

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
