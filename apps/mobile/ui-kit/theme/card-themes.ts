import type { Suit } from '@durak-master/schemas';

import { colors } from './tokens';

export type SuitPalette = Record<Suit, string>;

const twoColour = (red: string, black: string): SuitPalette => ({
  hearts: red,
  diamonds: red,
  spades: black,
  clubs: black
});

export const CARD_THEMES = [
  {
    id: 'classic',
    back: '#2B2340',
    backPattern: '#6C5B96',
    backPatternSoft: '#4C3F6B',
    face: '#F7F4EF',
    faceDimmed: '#D8D4CD',
    edge: '#8E8A83',
    accent: '#6C5B96',
    suits: twoColour('#C8102E', '#1A1A22')
  },
  {
    id: 'fourColour',
    back: '#1F3446',
    backPattern: '#4FA3E3',
    backPatternSoft: '#376C94',
    face: '#F7F4EF',
    faceDimmed: '#D8D4CD',
    edge: '#8E8A83',
    accent: '#4FA3E3',

    suits: {
      hearts: '#C8102E',
      diamonds: '#D98324',
      spades: '#1F6FB2',
      clubs: '#1E7D4F'
    }
  },
  {
    id: 'emerald',
    back: '#14342A',
    backPattern: '#56D38E',
    backPatternSoft: '#35845C',
    face: '#F4FAF6',
    faceDimmed: '#D5DED8',
    edge: '#8AA694',
    accent: '#56D38E',
    suits: twoColour('#C8102E', '#14342A')
  },
  {
    id: 'crimson',
    back: '#4A1420',
    backPattern: '#E0808F',
    backPatternSoft: '#954A58',
    face: '#FBF4F4',
    faceDimmed: '#DCD3D3',
    edge: '#A98F8F',
    accent: '#E8543F',
    suits: twoColour('#B01029', '#2A1418')
  },
  {
    id: 'noir',
    back: '#1A1E24',
    backPattern: '#7C8894',
    backPatternSoft: '#4B535C',
    face: '#EEF1F4',
    faceDimmed: '#D2D6DA',
    edge: '#8B949D',
    accent: colors.noirAccent,

    suits: twoColour('#5F6B78', '#12161B')
  }
] as const;

export type CardTheme = (typeof CARD_THEMES)[number];
export type CardThemeId = CardTheme['id'];

export const DEFAULT_CARD_THEME: CardThemeId = 'classic';

export const getCardTheme = (id: CardThemeId): CardTheme =>
  CARD_THEMES.find((theme) => theme.id === id) ?? CARD_THEMES[0];

export const suitColor = (theme: CardTheme, suit: Suit): string => theme.suits[suit];
