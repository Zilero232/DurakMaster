import type { BurkozelState } from '@durak-master/schemas';

import { BURKOZEL_HAND_SIZE, DEFAULT_BURKOZEL_RULES } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { burkozelModule } from '../../module';
import { createGame, startNextDeal } from '../index';

const USER_IDS = ['a', 'b', 'c', 'd'];

/** A deterministic "shuffle" so a deal can be replayed exactly. */
const fixedRandom = (): number => 0;

const newGame = (): BurkozelState =>
  createGame({
    tableId: 'table-1',
    settings: { game: 'burkozel', rules: DEFAULT_BURKOZEL_RULES } as never,
    userIds: USER_IDS,
    randomInt: fixedRandom
  });

/** The state the reducer leaves behind once a deal has been scored. */
const scoredDeal = (state: BurkozelState): BurkozelState => ({
  ...state,
  hands: Object.fromEntries(USER_IDS.map((userId) => [userId, []])),
  talon: [],
  isDealComplete: true,
  penalties: { ...state.penalties, a: 2 }
});

describe('burkozel deal', () => {
  it('deals a full hand to everyone and turns the trump up under the talon', () => {
    const state = newGame();

    for (const player of state.players) {
      expect(state.hands[player.userId]).toHaveLength(BURKOZEL_HAND_SIZE);
    }

    expect(state.trumpCard).not.toBeNull();
    expect(state.trump).toBe(state.trumpCard?.suit ?? 'spades');
    expect(state.dealNumber).toBe(1);
    expect(state.isDealComplete).toBe(false);
  });
});

describe('burkozel startNextDeal', () => {
  it('deals again and carries the penalties over', () => {
    const next = startNextDeal(scoredDeal(newGame()), fixedRandom);

    for (const player of next.players) {
      expect(next.hands[player.userId]).toHaveLength(BURKOZEL_HAND_SIZE);
      expect(player.handCount).toBe(BURKOZEL_HAND_SIZE);
      expect(next.tricksWon[player.userId]).toBe(0);
    }

    expect(next.penalties.a).toBe(2);
    expect(next.dealNumber).toBe(2);
    expect(next.isDealComplete).toBe(false);
    expect(next.trick).toHaveLength(0);
    expect(next.talon.length).toBeGreaterThan(0);
  });

  it('passes the lead clockwise', () => {
    const state = scoredDeal(newGame());
    const next = startNextDeal(state, fixedRandom);

    expect(next.leadSeat).toBe((state.leadSeat + 1) % USER_IDS.length);
    expect(next.activeSeat).toBe(next.leadSeat);
  });
});

describe('burkozel module hook', () => {
  it('deals again only once a deal is complete', () => {
    const state = newGame();

    expect(burkozelModule.startNextDeal?.(state, fixedRandom)).toBeNull();
    expect(burkozelModule.startNextDeal?.(scoredDeal(state), fixedRandom)).not.toBeNull();
  });

  it('leaves a finished match alone', () => {
    const finished: BurkozelState = { ...scoredDeal(newGame()), phase: 'finished' };

    expect(burkozelModule.startNextDeal?.(finished, fixedRandom)).toBeNull();
  });
});
