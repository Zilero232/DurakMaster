import type { Card, TablePair } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { canTransfer } from '../transfer';

const card = (rank: Card['rank'], suit: Card['suit'] = 'spades'): Card => ({ rank, suit });

const pair = (attack: Card, defense: Card | null = null): TablePair =>
  ({ attack, defense }) as TablePair;

const ROOMY_HAND = 6;

describe('canTransfer', () => {
  it('refuses on an empty table', () => {
    expect(canTransfer(card('nine'), [], ROOMY_HAND)).toBe(false);
  });

  it('refuses once any card has been beaten', () => {
    const table = [pair(card('nine'), card('king'))];

    expect(canTransfer(card('nine', 'hearts'), table, ROOMY_HAND)).toBe(false);
  });

  it('refuses a card of a different rank', () => {
    expect(canTransfer(card('king'), [pair(card('nine'))], ROOMY_HAND)).toBe(false);
  });

  it('transfers with a matching rank of another suit', () => {
    expect(canTransfer(card('nine', 'hearts'), [pair(card('nine'))], ROOMY_HAND)).toBe(true);
  });

  it('refuses when the table holds mixed ranks', () => {
    const table = [pair(card('nine')), pair(card('king'))];

    expect(canTransfer(card('nine', 'hearts'), table, ROOMY_HAND)).toBe(false);
  });

  it('adds one card per transfer, whatever the table holds', () => {
    const table = [pair(card('nine')), pair(card('nine', 'hearts'))];

    expect(canTransfer(card('nine', 'clubs'), table, ROOMY_HAND)).toBe(true);
  });

  it('refuses when the next defender could not cover the cards — the sufficiency rule', () => {
    const table = [pair(card('nine')), pair(card('nine', 'hearts'))];

    expect(canTransfer(card('nine', 'clubs'), table, 3)).toBe(true);
    expect(canTransfer(card('nine', 'clubs'), table, 2)).toBe(false);
  });
});
