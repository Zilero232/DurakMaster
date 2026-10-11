import type { Card, PlainCard, Rank, Suit, TablePair, ViewForGame } from '@durak-master/schemas';

import { DEFAULT_DURAK_RULES } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { canTransferCard } from '../transfer';

const card = (rank: Rank, suit: Suit = 'hearts'): PlainCard => ({ kind: 'plain', rank, suit });

const attack = (attacked: Card): TablePair => ({
  attack: attacked,
  defense: null,
  attackSeat: 0,
  defenseSeat: null
});

const player = (seat: number, handCount: number) => ({
  userId: `user-${seat}`,
  seat,
  handCount,
  isOut: false,
  outPlace: null,
  isDisconnected: false
});

const transferView = (table: TablePair[], nextHandCount = 6): ViewForGame<'durak'> => ({
  game: 'durak',
  tableId: 'table',
  rules: { ...DEFAULT_DURAK_RULES, mode: 'transfer' },
  players: [player(0, 6), player(1, 6), player(2, nextHandCount)],
  activeSeat: 1,
  phase: 'playing',
  turnDeadline: null,
  version: 3,
  hand: [],
  talonCount: 10,
  discardCount: 0,
  trump: 'spades',
  trumpCard: null,
  table,
  attackerSeat: 0,
  defenderSeat: 1,
  attackLimit: 6,
  passedSeats: [],
  shownTrumpSeats: [],
  isTaking: false,
  loserUserId: null,
  isDraw: false
});

describe('canTransferCard', () => {
  it('lets a card of the attacked rank move the attack on', () => {
    expect(canTransferCard(transferView([attack(card('seven'))]), card('seven', 'clubs'))).toBe(
      true
    );
  });

  it('refuses a card of another rank', () => {
    expect(canTransferCard(transferView([attack(card('seven'))]), card('eight'))).toBe(false);
  });

  it('refuses once a card on the table has been beaten', () => {
    const beaten = { ...attack(card('seven')), defense: card('nine'), defenseSeat: 1 };

    expect(canTransferCard(transferView([beaten]), card('seven', 'clubs'))).toBe(false);
  });

  it('refuses when the next defender could not cover every card', () => {
    const table = [attack(card('seven')), attack(card('seven', 'diamonds'))];

    expect(canTransferCard(transferView(table, 2), card('seven', 'clubs'))).toBe(false);
    expect(canTransferCard(transferView(table, 3), card('seven', 'clubs'))).toBe(true);
  });

  it('refuses outside transfer mode', () => {
    const view = { ...transferView([attack(card('seven'))]), rules: DEFAULT_DURAK_RULES };

    expect(canTransferCard(view, card('seven', 'clubs'))).toBe(false);
  });
});
