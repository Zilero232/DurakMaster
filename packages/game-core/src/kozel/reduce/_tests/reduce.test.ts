import type { Card, KozelState, Suit } from '@durak-master/schemas';

import { DEFAULT_KOZEL_RULES, KOZEL_TOTAL_POINTS } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { buildDeck } from '../../../shared';
import { handPoints } from '../../rules';
import { createGame, startNextDeal } from '../../setup';
import { reduce } from '../index';

const card = (rank: Card['rank'], suit: Suit): Card => ({ rank, suit });

const USER_IDS = ['a0', 'b0', 'a1', 'b1'];

/** A deterministic "shuffle" so a deal can be replayed exactly. */
const fixedRandom = (): ((maxExclusive: number) => number) => () => 0;

const newGame = (): KozelState =>
  createGame({
    tableId: 'table-1',
    settings: { game: 'kozel', rules: DEFAULT_KOZEL_RULES } as never,
    userIds: USER_IDS,
    randomInt: fixedRandom()
  });

const userAtSeat = (state: KozelState, seat: number): string =>
  state.players.find((player) => player.seat === seat)?.userId ?? '';

/** Plays one legal card for whoever is on turn. */
const playOne = (state: KozelState): KozelState => {
  const userId = userAtSeat(state, state.activeSeat);
  const hand = state.hands[userId] ?? [];

  for (const candidate of hand) {
    const result = reduce(state, userId, { type: 'play', card: candidate });

    if (result.ok) {
      return result.state;
    }
  }

  throw new Error(`No legal card for ${userId}`);
};

const playWholeDeal = (initial: KozelState): KozelState => {
  let state = initial;

  // Four players, eight tricks.
  for (let index = 0; index < 32; index++) {
    state = playOne(state);
  }

  return state;
};

describe('createGame', () => {
  it('deals the whole 32-card deck into four hands of eight', () => {
    const state = newGame();
    const dealt = USER_IDS.flatMap((userId) => state.hands[userId] ?? []);

    expect(dealt).toHaveLength(32);
    expect(new Set(dealt.map((entry) => `${entry.rank}${entry.suit}`)).size).toBe(32);

    for (const userId of USER_IDS) {
      expect(state.hands[userId]).toHaveLength(8);
    }
  });

  it('leaves no talon and no turned-up card — trump is fixed by the rules', () => {
    const state = newGame();

    expect(Object.hasOwn(state, 'talon')).toBe(false);
    expect(Object.hasOwn(state, 'trumpCard')).toBe(false);
  });

  it('deals a deck without sixes', () => {
    const state = newGame();
    const dealt = USER_IDS.flatMap((userId) => state.hands[userId] ?? []);

    expect(dealt.some((entry) => entry.rank === 'six')).toBe(false);
    expect(buildDeck(32)).toHaveLength(32);
  });

  it('opens with whoever holds the eight of clubs', () => {
    const state = newGame();
    const leaderId = userAtSeat(state, state.leadSeat);
    const hand = state.hands[leaderId] ?? [];

    expect(hand).toContainEqual(card('eight', 'clubs'));
    expect(state.activeSeat).toBe(state.leadSeat);
  });
});

describe('reduce', () => {
  it('refuses a card that is not in hand', () => {
    const state = newGame();
    const userId = userAtSeat(state, state.activeSeat);
    const missing =
      (state.hands[userId] ?? []).length > 0
        ? (buildDeck(32).find(
            (entry) =>
              !(state.hands[userId] ?? []).some(
                (held) => held.rank === entry.rank && held.suit === entry.suit
              )
          ) as Card)
        : card('ace', 'spades');

    const result = reduce(state, userId, { type: 'play', card: missing });

    expect(result.ok).toBe(false);
  });

  it('refuses a move out of turn', () => {
    const state = newGame();
    const waitingId = userAtSeat(state, (state.activeSeat + 1) % 4);
    const [held] = state.hands[waitingId] ?? [];

    const result = reduce(state, waitingId, { type: 'play', card: held as Card });

    expect(result).toMatchObject({ ok: false, error: 'NOT_YOUR_TURN' });
  });

  it('passes the turn clockwise inside a trick', () => {
    const state = newGame();
    const next = playOne(state);

    expect(next.activeSeat).toBe((state.activeSeat + 1) % 4);
    expect(next.trick).toHaveLength(1);
  });

  it('gives the next lead to whoever took the trick', () => {
    let state = newGame();

    for (let index = 0; index < 4; index++) {
      state = playOne(state);
    }

    expect(state.trick).toHaveLength(0);
    expect(state.trickNumber).toBe(1);
    expect(state.activeSeat).toBe(state.leadSeat);
  });

  it('splits exactly 120 points between the teams over a full deal', () => {
    const state = playWholeDeal(newGame());

    const won = USER_IDS.flatMap((userId) => state.wonCards[userId] ?? []);

    expect(won).toHaveLength(32);
    expect(handPoints(won)).toBe(KOZEL_TOTAL_POINTS);
    const [pointsA, pointsB] = state.lastDealPoints ?? [0, 0];

    expect(pointsA + pointsB).toBe(KOZEL_TOTAL_POINTS);
  });

  it('marks the deal complete and empties every hand', () => {
    const state = playWholeDeal(newGame());

    expect(state.trickNumber).toBe(8);
    expect(state.isDealComplete).toBe(true);

    for (const userId of USER_IDS) {
      expect(state.hands[userId]).toHaveLength(0);
    }
  });

  it('moves only the winner on the scoreboard', () => {
    const state = playWholeDeal(newGame());
    const [pairsA, pairsB] = state.pairs;

    // The winner takes one or two pairs; the loser is never charged anything.
    expect(pairsA === 0 || pairsB === 0).toBe(true);
    expect(pairsA + pairsB).toBeGreaterThanOrEqual(0);
    expect(pairsA + pairsB).toBeLessThanOrEqual(2);
  });
});

describe('startNextDeal', () => {
  it('deals again and stops for the winning team to name a leader', () => {
    const finished = playWholeDeal(newGame());
    const next = startNextDeal({ state: finished, randomInt: fixedRandom() });

    expect(next.phase).toBe('chooseLeader');
    expect(next.dealNumber).toBe(finished.dealNumber + 1);
    expect(next.isDealComplete).toBe(false);
    expect(next.trickNumber).toBe(0);

    for (const userId of USER_IDS) {
      expect(next.hands[userId]).toHaveLength(8);
    }
  });

  it('carries the scoreboard across deals', () => {
    const finished = playWholeDeal(newGame());
    const next = startNextDeal({ state: finished, randomInt: fixedRandom() });

    expect(next.pairs).toEqual(finished.pairs);
    expect(next.hadEggs).toBe(finished.hadEggs);
  });

  it('only lets the winning team choose the leader', () => {
    const finished = playWholeDeal(newGame());
    const next = startNextDeal({ state: finished, randomInt: fixedRandom() });

    const choosingSeat = next.leadSeat;
    const opponentSeat = (choosingSeat + 1) % 4;
    const opponentId = userAtSeat(next, opponentSeat);

    const refused = reduce(next, opponentId, { type: 'chooseLeader', seat: opponentSeat });

    expect(refused).toMatchObject({ ok: false, error: 'NOT_YOUR_TEAM' });

    const chooserId = userAtSeat(next, choosingSeat);
    const partnerSeat = (choosingSeat + 2) % 4;
    const accepted = reduce(next, chooserId, { type: 'chooseLeader', seat: partnerSeat });

    expect(accepted.ok).toBe(true);

    if (accepted.ok) {
      expect(accepted.state.phase).toBe('playing');
      expect(accepted.state.activeSeat).toBe(partnerSeat);
    }
  });
});
