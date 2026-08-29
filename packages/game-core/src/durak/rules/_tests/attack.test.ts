import type { Card, TablePair } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { isLegalAttackCard } from '../attack';

const card = (rank: Card['rank'], suit: Card['suit'] = 'spades'): Card => ({ rank, suit });

const pair = (attack: Card, defense: Card | null = null): TablePair =>
  ({ attack, defense }) as TablePair;

const LIMIT = 6;

describe('isLegalAttackCard', () => {
  it('opens a bout with any card', () => {
    expect(isLegalAttackCard(card('nine'), [], LIMIT)).toBe(true);
  });

  it('throws in a rank that is already on the table', () => {
    expect(isLegalAttackCard(card('nine', 'hearts'), [pair(card('nine'))], LIMIT)).toBe(true);
  });

  it('refuses a rank that is not on the table', () => {
    expect(isLegalAttackCard(card('king'), [pair(card('nine'))], LIMIT)).toBe(false);
  });

  it('accepts a rank opened by the defender’s own card', () => {
    const table = [pair(card('nine'), card('king'))];

    expect(isLegalAttackCard(card('king', 'hearts'), table, LIMIT)).toBe(true);
  });

  it('refuses once the bout has reached its attack limit', () => {
    const table = Array.from({ length: LIMIT }, () => pair(card('nine')));

    expect(isLegalAttackCard(card('nine', 'hearts'), table, LIMIT)).toBe(false);
  });

  it('counts every pair against the limit, defended or not', () => {
    const table = [
      pair(card('nine'), card('king')),
      pair(card('nine', 'hearts'), card('king', 'hearts'))
    ];

    expect(isLegalAttackCard(card('nine', 'clubs'), table, 2)).toBe(false);
    expect(isLegalAttackCard(card('nine', 'clubs'), table, 3)).toBe(true);
  });
});
