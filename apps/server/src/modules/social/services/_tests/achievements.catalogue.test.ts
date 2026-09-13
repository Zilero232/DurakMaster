import { ACHIEVEMENTS } from '@durak-master/schemas';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const LOCALES_DIR = join(import.meta.dirname, '../../../../../../mobile/shared/i18n/locales');

const readLabels = (locale: string): Record<string, unknown> => {
  const raw = readFileSync(join(LOCALES_DIR, locale, 'social.json'), 'utf8');

  return (JSON.parse(raw) as { achievements: Record<string, unknown> }).achievements;
};

const AWARDED_BY_SERVICE = new Set([
  'firstGame',
  'tenGames',
  'hundredGames',
  'thousandGames',
  'firstWin',
  'tenWins',
  'hundredWins',
  'winStreak3',
  'winStreak5',
  'winStreak10',
  'flawless',
  'flawlessTen',
  'loginStreak7',
  'loginStreak30',
  'firstFriend',
  'fiveFriends',
  'bigTable',
  'bigTableTen'
]);

describe('achievement catalogue', () => {
  it('awards every achievement it offers', () => {
    const offered = ACHIEVEMENTS.map((entry) => entry.id).sort();

    expect(offered).toEqual([...AWARDED_BY_SERVICE].sort());
  });

  it('carries a label in every locale', () => {
    for (const locale of ['ru', 'en']) {
      const labels = readLabels(locale);

      for (const entry of ACHIEVEMENTS) {
        expect(labels[entry.id], `${locale}/${entry.id}`).toBeDefined();
      }
    }
  });

  it('rewards more for the harder tier', () => {
    const tiers = [
      ['firstGame', 'tenGames', 'hundredGames', 'thousandGames'],
      ['firstWin', 'tenWins', 'hundredWins'],
      ['winStreak3', 'winStreak5', 'winStreak10'],
      ['flawless', 'flawlessTen'],
      ['loginStreak7', 'loginStreak30'],
      ['firstFriend', 'fiveFriends'],
      ['bigTable', 'bigTableTen']
    ];

    for (const tier of tiers) {
      const rewards = tier.map((id) => ACHIEVEMENTS.find((entry) => entry.id === id)?.reward ?? 0);

      expect(rewards, tier.join(' < ')).toEqual([...rewards].sort((a, b) => a - b));
    }
  });
});
