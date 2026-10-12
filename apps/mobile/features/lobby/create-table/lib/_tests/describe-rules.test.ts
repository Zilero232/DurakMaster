import { DEFAULT_DURAK_RULES } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { describeRules } from '../describe-rules';

const keysOf = (input: Parameters<typeof describeRules>[0]) =>
  describeRules(input).map((part) => part.key);

describe('describeRules', () => {
  it('names only the deck and the game type for the default rules', () => {
    expect(describeRules({ rules: DEFAULT_DURAK_RULES, isPrivate: false })).toEqual([
      { key: 'create.summary.deck', count: 36 },
      { key: 'games.durak.mode.throwIn' }
    ]);
  });

  it('adds every choice that departs from a plain game', () => {
    const rules = {
      ...DEFAULT_DURAK_RULES,
      mode: 'transfer' as const,
      throwInScope: 'neighbors' as const,
      fairness: 'cheaters' as const,
      withJokers: true,
      allowTransferByShowingTrump: true,
      firstMove: 'random' as const,
      allowDraw: false
    };

    expect(keysOf({ rules, isPrivate: true })).toEqual([
      'create.summary.deck',
      'games.durak.mode.transfer',
      'create.summary.neighbors',
      'games.durak.fairness.cheaters',
      'games.durak.withJokers',
      'games.durak.showTrump',
      'create.summary.randomFirstMove',
      'create.summary.noDraw',
      'lobby.privateTable'
    ]);
  });

  it('ignores passing by trump outside the transfer game', () => {
    const rules = { ...DEFAULT_DURAK_RULES, allowTransferByShowingTrump: true };

    expect(keysOf({ rules, isPrivate: false })).not.toContain('games.durak.showTrump');
  });
});
