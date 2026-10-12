import type { SettingsForGame } from '@durak-master/schemas';
import type { TFunction } from 'i18next';

import { DEFAULT_TABLE_SETTINGS } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { describeTableRules } from '../describe-table-rules';

const t = ((key: string) => key) as unknown as TFunction;

const DEFAULTS = DEFAULT_TABLE_SETTINGS.durak as SettingsForGame<'durak'>;

const withRules = (rules: Partial<SettingsForGame<'durak'>['rules']>) => ({
  ...DEFAULTS,
  rules: { ...DEFAULTS.rules, ...rules }
});

const icons = (settings: SettingsForGame<'durak'>) =>
  describeTableRules({ settings, t }).map((rule) => rule.icon);

const stripIcons = (settings: SettingsForGame<'durak'>) =>
  describeTableRules({ settings, t })
    .filter((rule) => rule.isInStrip)
    .map((rule) => rule.icon);

describe('describeTableRules', () => {
  it('always puts the bet, deck, mode and throw-in scope into the strip', () => {
    expect(stripIcons(DEFAULTS)).toEqual(['bet', 'deck', 'throwIn', 'allScope']);
  });

  it('adds cheaters, jokers and the fast speed to the strip only when they are on', () => {
    const settings = {
      ...withRules({ fairness: 'cheaters', withJokers: true }),
      speed: 'fast' as const
    };

    expect(stripIcons(settings)).toEqual([
      'bet',
      'deck',
      'throwIn',
      'allScope',
      'cheaters',
      'jokers',
      'fastSpeed'
    ]);
  });

  it('explains transfer by showing a trump only in transfer mode', () => {
    expect(icons(DEFAULTS)).not.toContain('showTrump');
    expect(icons(withRules({ mode: 'transfer' }))).toContain('showTrump');
  });

  it('shows the deck size and the bet as text in the strip', () => {
    const [bet, deck] = describeTableRules({ settings: { ...DEFAULTS, bet: 5_000 }, t });

    expect(bet.stripText).toBe('5K');
    expect(deck.stripText).toBe(String(DEFAULTS.rules.deckSize));
  });
});
