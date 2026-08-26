import { colors } from './tokens';

export const CARD_THEMES = [
  {
    id: 'classic',
    back: colors.feltDeep,
    backPattern: colors.gold,
    red: '#C8102E',
    black: '#1A2733',
    face: colors.surface1,
    accent: colors.gold
  },
  {
    id: 'emerald',
    back: '#14532D',
    backPattern: '#56D38E',
    red: '#C8102E',
    black: '#14342A',
    face: '#F5FBF7',
    accent: '#56D38E'
  },
  {
    id: 'crimson',
    back: '#6B1420',
    backPattern: '#F0A5A5',
    red: '#B01029',
    black: '#2A1418',
    face: '#FDF6F5',
    accent: '#EE362F'
  },
  {
    id: 'noir',
    back: '#1E262E',
    backPattern: '#8A99A8',
    red: '#5A6672',
    black: '#161C22',
    face: '#EDF1F5',
    accent: colors.noirAccent
  }
] as const;

export type CardTheme = (typeof CARD_THEMES)[number];
export type CardThemeId = CardTheme['id'];

export const DEFAULT_CARD_THEME: CardThemeId = 'classic';

export const getCardTheme = (id: CardThemeId): CardTheme =>
  CARD_THEMES.find((theme) => theme.id === id) ?? CARD_THEMES[0];
