import type { Card } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { HAND_SIZE, WIDOW_SIZE } from '../../config';
import { createGame } from '../../setup';
import {
  bidCeiling,
  cardPoints,
  handPoints,
  marriageSuits,
  rankValue,
  roundToStep
} from '../index';

const card = (rank: Card['rank'], suit: Card['suit']): Card => ({ rank, suit });

const createDeal = () =>
  createGame({
    tableId: 'table',
    settings: {
      rules: {
        twoPlayerMode: 'auction',
        bidStep: 5,
        roundingStep: 5,
        marriageOnFirstTrick: false,
        discardVisibility: 'closed',
        boltsMustBeConsecutive: false,
        barrelAttemptsCountAllDeals: true,
        winningScore: 1000,
        dumpTruck: false,
        skipBonus: 'none'
      }
    },
    userIds: ['a', 'b', 'c'],
    randomInt: (max) => max - 1
  });

describe('tysyacha ranks', () => {
  it('puts the ten between the king and the ace', () => {
    expect(rankValue(card('ten', 'spades'))).toBeGreaterThan(rankValue(card('king', 'spades')));
    expect(rankValue(card('ace', 'spades'))).toBeGreaterThan(rankValue(card('ten', 'spades')));
  });

  it('scores the whole deck at 120 points', () => {
    const deck: Card[] = (['spades', 'hearts', 'diamonds', 'clubs'] as const).flatMap((suit) =>
      (['nine', 'jack', 'queen', 'king', 'ten', 'ace'] as const).map((rank) => card(rank, suit))
    );

    expect(handPoints(deck)).toBe(120);
  });
});

describe('tysyacha marriages', () => {
  it('finds a marriage only when both the king and the queen are held', () => {
    const hand = [card('king', 'hearts'), card('queen', 'hearts'), card('king', 'spades')];

    expect(marriageSuits(hand)).toEqual(['hearts']);
  });

  it('raises the bid ceiling by the marriage value', () => {
    expect(bidCeiling([card('nine', 'spades')])).toBe(120);
    expect(bidCeiling([card('king', 'hearts'), card('queen', 'hearts')])).toBe(220);
  });
});

describe('tysyacha rounding', () => {
  it('rounds a defender score to the nearest step', () => {
    expect(roundToStep(17, 5)).toBe(15);
    expect(roundToStep(18, 5)).toBe(20);
  });
});

describe('tysyacha deal', () => {
  it('deals seven cards each and sets three aside', () => {
    const state = createDeal();

    expect(state.widow).toHaveLength(WIDOW_SIZE);

    for (const player of state.players) {
      expect(state.hands[player.userId]).toHaveLength(HAND_SIZE);
    }

    expect(cardPoints(card('ace', 'spades'))).toBe(11);
  });
});
