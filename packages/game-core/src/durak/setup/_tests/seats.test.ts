import type { Card, PlayerState } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { card } from '../../_tests/fixture';
import { findFirstAttackerSeat } from '../seats';

const RED_JOKER: Card = { kind: 'joker', color: 'red' };
const BLACK_JOKER: Card = { kind: 'joker', color: 'black' };

const seatsFor = (hands: Record<string, Card[]>): PlayerState[] =>
  Object.keys(hands).map((userId, seat) => ({
    userId,
    seat,
    handCount: hands[userId]?.length ?? 0,
    isOut: false,
    outPlace: null,
    isDisconnected: false
  }));

describe('durak first move', () => {
  it('goes to the holder of the lowest trump, even over a lower plain card', () => {
    const hands = {
      a: [card('six', 'hearts'), card('ten', 'spades')],
      b: [card('seven', 'spades'), card('eight', 'hearts')]
    };

    expect(findFirstAttackerSeat(hands, seatsFor(hands), 'spades')).toBe(1);
  });

  it('goes to the holder of the lowest card when nobody holds a trump', () => {
    const hands = {
      a: [card('ten', 'hearts'), card('jack', 'spades')],
      b: [card('nine', 'hearts'), card('king', 'diamonds')]
    };

    expect(findFirstAttackerSeat(hands, seatsFor(hands), 'clubs')).toBe(1);
  });

  it('never picks a joker as the lowest trump', () => {
    const hands = {
      a: [RED_JOKER, card('ace', 'hearts')],
      b: [card('king', 'spades')]
    };

    expect(findFirstAttackerSeat(hands, seatsFor(hands), 'spades')).toBe(1);
  });

  it('never picks a joker as the lowest card when nobody holds a trump', () => {
    const hands = {
      a: [RED_JOKER, card('ace', 'hearts')],
      b: [card('king', 'diamonds')]
    };

    expect(findFirstAttackerSeat(hands, seatsFor(hands), 'clubs')).toBe(1);
  });

  it('falls back to seat order when only jokers are in play', () => {
    const hands = { a: [RED_JOKER], b: [BLACK_JOKER] };

    expect(findFirstAttackerSeat(hands, seatsFor(hands), 'spades')).toBe(0);
  });
});
