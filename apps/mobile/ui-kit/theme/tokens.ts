export const colors = {
  background: '#191526',
  backgroundDeep: '#110E1C',

  backgroundTop: '#241D38',
  backgroundBottom: '#120F1D',

  feltCore: '#2A3B33',
  feltMid: '#233229',
  feltDeep: '#1B2721',
  feltEdge: '#141D19',

  foreground: '#F4F1EC',

  surface1: '#241E36',
  surface2: '#2E2743',
  surface3: '#3B3255',
  surfaceOverlay: '#282141',

  onFelt: '#F4F1EC',
  onFeltMuted: '#ABA3C2',

  mutedForeground: '#ABA3C2',
  subtleForeground: '#7C7398',

  accent: '#E8543F',
  accentBright: '#FF6C52',
  accentDim: '#B83E2C',

  gold: '#D9A441',
  goldBright: '#F0BE5C',
  goldDim: '#A87C2C',
  goldDeep: '#3A2A0C',

  danger: '#E0483F',
  dangerDim: '#A8332C',
  success: '#47B67D',
  info: '#4FA3E3',

  trump: '#4FA3E3',
  attack: '#E8543F',
  defense: '#47B67D',
  discard: '#7C7398',

  primary: '#E8543F',
  primaryForeground: '#FFFFFF',

  noirAccent: '#C7D2DE',

  border: 'rgba(196, 184, 232, 0.12)',
  borderStrong: 'rgba(196, 184, 232, 0.22)',
  borderGold: 'rgba(217, 164, 65, 0.55)',
  borderAccent: 'rgba(232, 84, 63, 0.55)',

  glass: 'rgba(244, 241, 236, 0.08)',
  glassStrong: 'rgba(244, 241, 236, 0.14)',
  glassBorder: 'rgba(244, 241, 236, 0.16)',
  glassHighlight: 'rgba(244, 241, 236, 0.24)',

  scrim: 'rgba(12, 9, 22, 0.74)',

  transparent: 'transparent'
} as const;

export const screenGradient = [
  colors.backgroundTop,
  colors.background,
  colors.backgroundBottom
] as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  card: 8,
  pill: 999
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48
} as const;

export const iconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  hero: 56
} as const;

export const borderWidth = {
  hairline: 1,
  regular: 2
} as const;

export const fontFamily = {
  sans: 'Nunito_400Regular',
  sansSemi: 'Nunito_600SemiBold',
  sansBold: 'Nunito_800ExtraBold',
  display: 'Rubik_600SemiBold',
  displayBold: 'Rubik_800ExtraBold'
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34
} as const;

export const lineHeight = {
  tight: (size: number) => Math.round(size * 1.2),
  normal: (size: number) => Math.round(size * 1.35),
  relaxed: (size: number) => Math.round(size * 1.55)
} as const;

const shadow = (opacity: number, radius: number, offsetY: number, elevation: number) => ({
  boxShadow: `0px ${offsetY}px ${radius}px rgba(0, 0, 0, ${opacity})`,
  elevation
});

export const shadows = {
  card: shadow(0.35, 8, 3, 3),
  cardRaised: shadow(0.45, 18, 8, 8),
  panel: shadow(0.55, 28, 12, 12),
  tile: shadow(0.3, 5, 2, 2),
  button: shadow(0.4, 8, 3, 4)
} as const;

export const glow = {
  accent: { boxShadow: `0px 0px 12px ${colors.accentBright}`, elevation: 6 },
  trump: { boxShadow: `0px 0px 12px ${colors.trump}`, elevation: 6 },
  success: { boxShadow: `0px 0px 12px ${colors.success}`, elevation: 6 }
} as const;

export const card = {
  ratio: 2 / 3,
  radius: radii.card,
  overlap: -0.45
} as const;

export const duration = {
  fast: 140,
  card: 220,
  panel: 280
} as const;

export type Colors = typeof colors;
