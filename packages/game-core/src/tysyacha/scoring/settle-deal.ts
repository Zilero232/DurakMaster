import type { TysyachaState } from '@durak-master/schemas';

import { MARRIAGE_POINTS } from '@durak-master/schemas';

import { handPoints, roundToStep } from '../rules';

export const marriagePoints = (state: TysyachaState, seat: number): number =>
  state.declaredMarriages
    .filter((entry) => entry.seat === seat)
    .reduce((total, entry) => total + MARRIAGE_POINTS[entry.suit], 0);

export const dealPoints = (state: TysyachaState, seat: number): number => {
  const userId = state.players.find((player) => player.seat === seat)?.userId;

  if (!userId) {
    return 0;
  }

  return handPoints(state.wonCards[userId] ?? []) + marriagePoints(state, seat);
};

export const settleDeal = (state: TysyachaState): Record<string, number> => {
  const next = { ...state.scores };

  for (const player of state.players) {
    const points = dealPoints(state, player.seat);

    if (player.seat === state.declarerSeat) {
      const contract = state.contract ?? 0;

      next[player.userId] =
        (next[player.userId] ?? 0) + (points >= contract ? contract : -contract);

      continue;
    }

    next[player.userId] =
      (next[player.userId] ?? 0) + roundToStep(points, state.rules.roundingStep);
  }

  return next;
};

export const settleConcession = (state: TysyachaState): Record<string, number> => {
  const next = { ...state.scores };
  const contract = state.contract ?? 0;

  for (const player of state.players) {
    if (player.seat === state.declarerSeat) {
      next[player.userId] = (next[player.userId] ?? 0) - contract;

      continue;
    }

    next[player.userId] =
      (next[player.userId] ?? 0) + roundToStep(contract / 2, state.rules.roundingStep);
  }

  return next;
};
