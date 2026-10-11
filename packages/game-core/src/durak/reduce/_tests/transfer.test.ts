import type { Card, DurakState } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { buildState, card, pair } from '../../_tests/fixture';
import { reduce } from '../index';

const RED_JOKER: Card = { kind: 'joker', color: 'red' };

const NINE_OF_CLUBS = card('nine', 'clubs');

const transferTable = (overrides: Partial<DurakState> = {}): DurakState =>
  buildState({
    hands: {
      a: [card('six', 'diamonds'), card('seven', 'diamonds')],
      b: [NINE_OF_CLUBS, card('nine', 'spades'), card('ace', 'clubs'), RED_JOKER],
      c: [card('six', 'hearts'), card('seven', 'hearts'), card('eight', 'hearts')]
    },
    table: [pair(card('nine', 'hearts'))],
    activeSeat: 1,
    rules: { mode: 'transfer', allowTransferByShowingTrump: true },
    ...overrides
  });

describe('durak transfer', () => {
  it('passes the attack on to the next player', () => {
    const result = reduce(transferTable(), 'b', { type: 'transfer', card: NINE_OF_CLUBS });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.state.defenderSeat).toBe(2);
    expect(result.state.table).toHaveLength(2);
  });

  it('is refused while the defender is taking', () => {
    const result = reduce(transferTable({ isTaking: true }), 'b', {
      type: 'transfer',
      card: NINE_OF_CLUBS
    });

    expect(result).toEqual({ ok: false, error: 'INVALID_ACTION_FOR_PHASE' });
  });

  it('is refused on an empty table as the wrong phase', () => {
    const result = reduce(transferTable({ table: [] }), 'b', {
      type: 'transfer',
      card: NINE_OF_CLUBS
    });

    expect(result).toEqual({ ok: false, error: 'INVALID_ACTION_FOR_PHASE' });
  });

  it('reports a rank mismatch when the table holds mixed ranks', () => {
    const table = [pair(card('nine', 'hearts')), pair(card('king', 'hearts'))];

    const result = reduce(transferTable({ table }), 'b', { type: 'transfer', card: NINE_OF_CLUBS });

    expect(result).toEqual({ ok: false, error: 'TRANSFER_RANK_MISMATCH' });
  });

  it('refuses a bout that holds a joker', () => {
    const table = [pair(RED_JOKER)];

    const result = reduce(transferTable({ table }), 'b', {
      type: 'transfer',
      card: card('ace', 'clubs')
    });

    expect(result).toEqual({ ok: false, error: 'TRANSFER_NOT_ALLOWED' });
  });

  it('refuses a joker as the transfer card', () => {
    const table = [pair(card('ace', 'hearts'))];

    const result = reduce(transferTable({ table }), 'b', { type: 'transfer', card: RED_JOKER });

    expect(result).toEqual({ ok: false, error: 'TRANSFER_NOT_ALLOWED' });
  });

  it('refuses when the next defender could not cover the cards', () => {
    const state = transferTable();

    const result = reduce(
      { ...state, hands: { ...state.hands, c: [card('six', 'hearts')] } },
      'b',
      {
        type: 'transfer',
        card: NINE_OF_CLUBS
      }
    );

    expect(result).toEqual({ ok: false, error: 'TRANSFER_TARGET_HAS_TOO_FEW_CARDS' });
  });
});

describe('durak transfer by showing a trump', () => {
  it('is allowed only once per seat', () => {
    const state = buildState({
      hands: {
        a: [NINE_OF_CLUBS, card('six', 'diamonds')],
        b: [card('nine', 'spades'), card('seven', 'diamonds')]
      },
      table: [pair(card('nine', 'hearts'))],
      activeSeat: 1,
      rules: { mode: 'transfer', allowTransferByShowingTrump: true }
    });

    const shown = reduce(state, 'b', { type: 'transferByShowing', card: card('nine', 'spades') });

    expect(shown.ok).toBe(true);

    if (!shown.ok) {
      return;
    }

    expect(shown.state.shownTrumpSeats).toEqual([1]);
    expect(shown.state.defenderSeat).toBe(0);

    const passedBack = reduce(shown.state, 'a', { type: 'transfer', card: NINE_OF_CLUBS });

    expect(passedBack.ok).toBe(true);

    if (!passedBack.ok) {
      return;
    }

    expect(passedBack.state.defenderSeat).toBe(1);

    const shownAgain = reduce(passedBack.state, 'b', {
      type: 'transferByShowing',
      card: card('nine', 'spades')
    });

    expect(shownAgain).toEqual({ ok: false, error: 'TRANSFER_NOT_ALLOWED' });
  });
});
