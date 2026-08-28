import type { Card, Suit } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { teamOfSeat } from '../../../shared';
import { scoreDeal } from '../score-deal';

const card = (rank: Card['rank'], suit: Suit): Card => ({ rank, suit });

const ACE = (suit: Suit) => card('ace', suit); // 11
const TEN = (suit: Suit) => card('ten', suit); // 10
const KING = (suit: Suit) => card('king', suit); // 4
const QUEEN = (suit: Suit) => card('queen', suit); // 3
const JACK = (suit: Suit) => card('jack', suit); // 2
const BLANK = (suit: Suit) => card('nine', suit); // 0

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

/** Every scoring card in the deck: 4×11 + 4×10 + 4×4 + 4×3 + 4×2 = 120. */
const allScoringCards = (): Card[] => [
  ...SUITS.map(ACE),
  ...SUITS.map(TEN),
  ...SUITS.map(KING),
  ...SUITS.map(QUEEN),
  ...SUITS.map(JACK)
];

const seatByUserId = { a0: 0, b0: 1, a1: 2, b1: 3 };

type DealInput = {
  teamA: Card[];
  teamB: Card[];
  tricksA: number;
  tricksB: number;
};

const score = ({ teamA, teamB, tricksA, tricksB }: DealInput) =>
  scoreDeal({
    wonCards: { a0: teamA, b0: teamB, a1: [], b1: [] },
    tricksWon: { a0: tricksA, b0: tricksB, a1: 0, b1: 0 },
    seatByUserId
  });

/** Splits the scoring cards so team A ends up with exactly `targetA` points. */
const splitFor = (targetA: number): { teamA: Card[]; teamB: Card[] } => {
  const teamA: Card[] = [];
  const teamB: Card[] = [];
  let left = targetA;

  for (const entry of allScoringCards()) {
    const value =
      entry.rank === 'ace'
        ? 11
        : entry.rank === 'ten'
          ? 10
          : entry.rank === 'king'
            ? 4
            : entry.rank === 'queen'
              ? 3
              : 2;

    if (value <= left) {
      teamA.push(entry);
      left -= value;
    } else {
      teamB.push(entry);
    }
  }

  if (left !== 0) {
    throw new Error(`Cannot build a hand worth exactly ${targetA} points`);
  }

  return { teamA, teamB };
};

describe('teamOfSeat', () => {
  it('seats partners opposite each other', () => {
    expect(teamOfSeat(0)).toBe(0);
    expect(teamOfSeat(2)).toBe(0);
    expect(teamOfSeat(1)).toBe(1);
    expect(teamOfSeat(3)).toBe(1);
  });
});

describe('scoreDeal', () => {
  it('rejects a deal that does not add up to 120', () => {
    expect(() => score({ teamA: [ACE('spades')], teamB: [], tricksA: 8, tricksB: 0 })).toThrow(
      /120/
    );
  });

  it('pays one pair for an ordinary win', () => {
    const { teamA, teamB } = splitFor(70);
    const outcome = score({ teamA, teamB, tricksA: 5, tricksB: 3 });

    expect(outcome.points).toEqual([70, 50]);
    expect(outcome.pairsGained).toEqual([1, 0]);
    expect(outcome.resetTeam).toBeNull();
  });

  it('pays two pairs past 90 when the loser still took a trick', () => {
    const { teamA, teamB } = splitFor(100);
    const outcome = score({ teamA, teamB, tricksA: 7, tricksB: 1 });

    expect(outcome.points).toEqual([100, 20]);
    expect(outcome.pairsGained).toEqual([2, 0]);
  });

  it('pays a single pair past 90 once the loser has reached spas', () => {
    const { teamA, teamB } = splitFor(87);
    const outcome = score({ teamA, teamB, tricksA: 6, tricksB: 2 });

    // 33 points clears the spas threshold of 31, so the defeat is not doubled.
    expect(outcome.points).toEqual([87, 33]);
    expect(outcome.pairsGained).toEqual([1, 0]);
  });

  it('doubles the defeat when the loser stayed under spas', () => {
    const { teamA, teamB } = splitFor(90);
    const outcome = score({ teamA, teamB, tricksA: 6, tricksB: 2 });

    expect(outcome.points).toEqual([90, 30]);
    expect(outcome.pairsGained).toEqual([2, 0]);
  });

  it('resets the opponent and pays nothing for a lyusya', () => {
    const outcome = score({
      teamA: allScoringCards(),
      teamB: [],
      tricksA: 8,
      tricksB: 0
    });

    expect(outcome.points).toEqual([120, 0]);
    expect(outcome.pairsGained).toEqual([0, 0]);
    expect(outcome.resetTeam).toBe(1);
  });

  it('treats 120 points with a trick left to the loser as a double win, not a lyusya', () => {
    // All the value but not every trick: the blank cards went the other way.
    const outcome = score({
      teamA: allScoringCards(),
      teamB: [BLANK('spades'), BLANK('hearts')],
      tricksA: 7,
      tricksB: 1
    });

    expect(outcome.resetTeam).toBeNull();
    expect(outcome.pairsGained).toEqual([2, 0]);
  });

  it('moves nobody on 60:60 but records the eggs', () => {
    const { teamA, teamB } = splitFor(60);
    const outcome = score({ teamA, teamB, tricksA: 4, tricksB: 4 });

    expect(outcome.points).toEqual([60, 60]);
    expect(outcome.pairsGained).toEqual([0, 0]);
    expect(outcome.hadEggs).toBe(true);
    expect(outcome.winnerTeam).toBeNull();
  });

  it('counts spas in points rather than in tricks', () => {
    const { teamA, teamB } = splitFor(95);
    // Three tricks and still short of 31 points: no protection from the double loss.
    const outcome = score({ teamA, teamB, tricksA: 5, tricksB: 3 });

    expect(outcome.points[1]).toBe(25);
    expect(outcome.pairsGained).toEqual([2, 0]);
  });
});
