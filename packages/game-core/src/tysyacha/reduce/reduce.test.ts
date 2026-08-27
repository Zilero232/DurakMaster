import type { Card, TysyachaState } from '@durak-master/schemas';

import { DEFAULT_TYSYACHA_RULES } from '@durak-master/schemas';
import { describe, expect, it } from 'bun:test';

import { decideBotAction } from '../bot';
import { HAND_SIZE, WIDOW_SIZE } from '../config';
import { tysyachaModule } from '../module';
import { createGame, startNextDeal } from '../setup';
import { reduce } from './index';

const USER_IDS = ['a', 'b', 'c'];

/** A deterministic "shuffle" so a deal can be replayed exactly. */
const fixedRandom = (maxExclusive: number): number => maxExclusive - 1;

const newGame = (): TysyachaState =>
  createGame({
    tableId: 'table-1',
    settings: { rules: DEFAULT_TYSYACHA_RULES },
    userIds: USER_IDS,
    randomInt: fixedRandom
  });

const userAtSeat = (state: TysyachaState, seat: number): string =>
  state.players.find((player) => player.seat === seat)?.userId ?? '';

/** The declarer's cards, ordered as they sit in hand. */
const handOf = (state: TysyachaState, userId: string): Card[] => state.hands[userId] ?? [];

/** Everyone but the first bidder passes, so the auction ends at the minimum bid. */
const bidToDiscarding = (): TysyachaState => {
  let state = newGame();

  for (const userId of ['b', 'c']) {
    const result = reduce(state, userId, { type: 'pass' });

    expect(result.ok).toBe(true);

    if (result.ok) {
      state = result.state;
    }
  }

  return state;
};

describe('tysyacha deal', () => {
  it('deals every card of the 24-card deck exactly once', () => {
    const state = newGame();
    const all = [...state.widow, ...Object.values(state.hands).flat()];
    const unique = new Set(all.map((card) => `${card.rank}:${card.suit}`));

    expect(all).toHaveLength(24);
    expect(unique.size).toBe(24);
  });

  it('hands the widow to the declarer once the auction is over', () => {
    const state = bidToDiscarding();
    const declarer = userAtSeat(state, state.declarerSeat ?? -1);

    expect(state.stage).toBe('discarding');
    expect(state.hands[declarer]).toHaveLength(HAND_SIZE + WIDOW_SIZE);
  });
});

describe('tysyacha discard', () => {
  it('accepts a gift to each opponent and starts the play', () => {
    const state = bidToDiscarding();
    const declarerSeat = state.declarerSeat ?? -1;
    const declarer = userAtSeat(state, declarerSeat);
    const cards = handOf(state, declarer).slice(0, 2);
    const opponents = state.players.filter((player) => player.seat !== declarerSeat);

    const result = reduce(state, declarer, {
      type: 'discard',
      cards,
      gifts: opponents.map((player, index) => ({ seat: player.seat, card: cards[index] as Card }))
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const next = result.state;

    expect(next.stage).toBe('playing');
    expect(next.activeSeat).toBe(declarerSeat);

    // 24 cards split evenly once the widow has been passed on.
    for (const player of next.players) {
      expect(next.hands[player.userId]).toHaveLength(8);
      expect(player.handCount).toBe(8);
    }
  });

  it('rejects a discard that gifts the same card twice', () => {
    const state = bidToDiscarding();
    const declarerSeat = state.declarerSeat ?? -1;
    const declarer = userAtSeat(state, declarerSeat);
    const [card] = handOf(state, declarer) as [Card];
    const opponents = state.players.filter((player) => player.seat !== declarerSeat);

    const result = reduce(state, declarer, {
      type: 'discard',
      cards: [card, card],
      gifts: opponents.map((player) => ({ seat: player.seat, card }))
    });

    expect(result.ok).toBe(false);
  });

  it('rejects a discard that keeps more cards than it gives away', () => {
    const state = bidToDiscarding();
    const declarerSeat = state.declarerSeat ?? -1;
    const declarer = userAtSeat(state, declarerSeat);
    const cards = handOf(state, declarer).slice(0, 2);
    const opponents = state.players.filter((player) => player.seat !== declarerSeat);

    const result = reduce(state, declarer, {
      type: 'discard',
      cards: cards.slice(0, 1),
      gifts: opponents.map((player, index) => ({ seat: player.seat, card: cards[index] as Card }))
    });

    expect(result.ok).toBe(false);
  });

  it("accepts the bot's own discard", () => {
    const state = bidToDiscarding();
    const declarer = userAtSeat(state, state.declarerSeat ?? -1);
    const result = reduce(state, declarer, decideBotAction(state, declarer));

    expect(result.ok).toBe(true);
  });
});

/** The state the reducer leaves behind once a deal has been scored. */
const scoredDeal = (state: TysyachaState): TysyachaState => ({
  ...state,
  stage: 'scoring',
  hands: Object.fromEntries(USER_IDS.map((userId) => [userId, []])),
  scores: { ...state.scores, a: 120 }
});

describe('tysyacha startNextDeal', () => {
  it('deals again and carries the scoreboard over', () => {
    const next = startNextDeal(scoredDeal(newGame()), fixedRandom);

    for (const player of next.players) {
      expect(next.hands[player.userId]).toHaveLength(HAND_SIZE);
      expect(player.handCount).toBe(HAND_SIZE);
    }

    expect(next.scores.a).toBe(120);
    expect(next.widow).toHaveLength(WIDOW_SIZE);
    expect(next.stage).toBe('bidding');
    expect(next.dealNumber).toBe(2);
    expect(next.contract).toBeNull();
    expect(next.declarerSeat).toBeNull();
    expect(next.bids).toHaveLength(0);
  });

  it('passes the deal clockwise', () => {
    const state = scoredDeal(newGame());
    const next = startNextDeal(state, fixedRandom);

    expect(next.dealerSeat).toBe((state.dealerSeat + 1) % USER_IDS.length);
    expect(next.activeSeat).toBe((next.dealerSeat + 1) % USER_IDS.length);
  });
});

describe('tysyacha module hook', () => {
  it('deals again only once a deal has been scored', () => {
    const state = newGame();

    expect(tysyachaModule.startNextDeal?.(state, fixedRandom)).toBeNull();
    expect(tysyachaModule.startNextDeal?.(scoredDeal(state), fixedRandom)).not.toBeNull();
  });

  it('leaves a finished match alone', () => {
    const finished: TysyachaState = { ...scoredDeal(newGame()), phase: 'finished' };

    expect(tysyachaModule.startNextDeal?.(finished, fixedRandom)).toBeNull();
  });
});
