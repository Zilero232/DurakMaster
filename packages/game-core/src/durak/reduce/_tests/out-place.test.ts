import type { DurakState } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { decideBotAction } from '../../bot';
import { createGame } from '../../setup';
import { reduce } from '../index';

const RULES = {
  mode: 'throwIn' as const,
  deckSize: 24 as const,
  throwInScope: 'all' as const,
  fairness: 'fair' as const,
  allowDraw: false,
  firstMove: 'lowestTrump' as const,
  allowTransferByShowingTrump: false,
  withJokers: false,
  attackLimit: 6
};

const createGameOf = (userIds: string[]): DurakState =>
  createGame({
    tableId: 'table',
    settings: {
      game: 'durak',
      bet: 0,
      maxPlayers: userIds.length,
      isPrivate: false,
      speed: 'normal',
      turnTimeoutSeconds: 30,
      rules: RULES
    },
    userIds,
    randomInt: (max) => max - 1
  });

const playToTheEnd = (start: DurakState): DurakState => {
  let state = start;

  for (let step = 0; step < 4000 && state.phase !== 'finished'; step += 1) {
    const actor = state.players.find((player) => player.seat === state.activeSeat);

    if (!actor) {
      break;
    }

    const action = decideBotAction(state, actor.userId);

    if (!action) {
      break;
    }

    const result = reduce(state, actor.userId, action);

    if (!result.ok) {
      break;
    }

    state = result.state;
  }

  return state;
};

describe('durak exit order', () => {
  it('starts every player without an exit place', () => {
    const state = createGameOf(['a', 'b', 'c']);

    expect(state.players.every((player) => player.outPlace === null)).toBe(true);
  });

  it('numbers players in the order they went out, leaving the loser unplaced', () => {
    const finished = playToTheEnd(createGameOf(['a', 'b', 'c', 'd']));

    expect(finished.phase).toBe('finished');

    const placed = finished.players
      .filter((player) => player.outPlace !== null)
      .map((player) => player.outPlace);

    // places are handed out densely from 1, so the pot split has no gaps to reason about
    expect([...placed].sort((left, right) => (left ?? 0) - (right ?? 0))).toEqual(
      placed.map((_, index) => index + 1)
    );

    const loser = finished.players.find((player) => player.userId === finished.loserUserId);

    expect(loser?.outPlace ?? null).toBeNull();
  });

  it('gives a place to every player who went out safely, and to nobody else', () => {
    const finished = playToTheEnd(createGameOf(['a', 'b', 'c']));

    for (const player of finished.players) {
      const wentOutSafely = player.isOut && player.userId !== finished.loserUserId;

      expect(player.outPlace !== null).toBe(wentOutSafely);
    }
  });
});
