export const colors = {
  feltCore: '#5B7F9D',
  feltMid: '#486D8D',
  feltDeep: '#355879',
  feltEdge: '#223F5C',

  background: '#436787',
  foreground: '#101C28',

  surface1: '#FFFFFF',
  surface2: '#F3F5F8',
  surface3: '#E4E8ED',
  surfaceOverlay: '#FFFFFF',

  onFelt: '#FAFCFE',
  onFeltMuted: '#D2D8DF',

  mutedForeground: '#555F69',
  subtleForeground: '#7F8790',

  accent: '#D01D21',
  accentBright: '#EE362F',
  accentDim: '#A91518',

  gold: '#E1AF3B',
  goldBright: '#F7CB58',
  goldDim: '#B78A2C',
  goldDeep: '#6F4F07',

  danger: '#D01D21',
  dangerDim: '#A91518',
  success: '#1A9951',
  info: '#008BC2',

  noirAccent: '#C7D2DE',

  primary: '#D01D21',
  primaryForeground: '#FFFFFF',

  border: 'rgba(16, 28, 40, 0.12)',
  borderStrong: 'rgba(16, 28, 40, 0.22)',
  borderGold: 'rgba(225, 175, 59, 0.6)',
  borderAccent: 'rgba(208, 29, 33, 0.55)',

  glassBorder: 'rgba(255, 255, 255, 0.55)',
  glassHighlight: 'rgba(255, 255, 255, 0.8)',

  scrim: 'rgba(16, 28, 40, 0.55)',

  transparent: 'transparent'
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 26,
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

const shadow = (opacity: number, radius: number, offsetY: number, elevation: number) => ({
  boxShadow: `0px ${offsetY}px ${radius}px rgba(10, 21, 32, ${opacity})`,
  elevation
});

export const shadows = {
  card: shadow(0.22, 6, 3, 3),
  cardRaised: shadow(0.3, 14, 7, 8),
  panel: shadow(0.35, 18, 8, 12),
  tile: shadow(0.2, 4, 2, 2),
  button: shadow(0.28, 6, 3, 4)
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
