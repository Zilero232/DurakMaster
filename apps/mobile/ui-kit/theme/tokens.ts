export const colors = {
  background: '#123048',
  backgroundDeep: '#0B2033',

  backgroundTop: '#17405E',
  backgroundBottom: '#0D2438',

  feltCore: '#1B5878',
  feltMid: '#164863',
  feltDeep: '#103850',
  feltEdge: '#0A2438',
  feltGlow: '#2E7398',
  feltWeave: '#0B2B41',

  foreground: '#F4F1EC',

  surface1: '#17405E',
  surface2: '#1D5075',
  surface3: '#256189',
  surfaceOverlay: '#143A55',

  onFelt: '#F4F1EC',
  onFeltMuted: '#A9C4D8',

  mutedForeground: '#A9C4D8',
  subtleForeground: '#93B4CB',

  accent: '#E8B44A',
  accentBright: '#FFCE76',
  accentDim: '#B8862C',

  gold: '#D9A441',
  goldBright: '#F0BE5C',
  goldDim: '#A87C2C',
  goldDeep: '#3A2A0C',

  danger: '#DE3B4F',
  dangerDim: '#A62838',
  success: '#3FBF86',
  successDim: '#2E9A69',
  info: '#4FA3E3',

  trump: '#4FA3E3',
  attack: '#E8B44A',
  defense: '#3FBF86',
  discard: '#7C7398',

  primary: '#E8B44A',
  primaryForeground: '#15304A',

  noirAccent: '#C7D2DE',

  border: 'rgba(214, 234, 247, 0.22)',
  borderStrong: 'rgba(214, 234, 247, 0.38)',
  borderGold: 'rgba(217, 164, 65, 0.55)',
  borderAccent: 'rgba(232, 180, 74, 0.55)',

  glass: 'rgba(244, 241, 236, 0.08)',
  glassStrong: 'rgba(244, 241, 236, 0.14)',
  glassBorder: 'rgba(244, 241, 236, 0.16)',
  glassHighlight: 'rgba(244, 241, 236, 0.24)',

  scrim: 'rgba(6, 20, 32, 0.76)',
  scrimStrong: 'rgba(6, 20, 32, 0.92)',

  transparent: 'transparent'
} as const;

export const screenGradient = [
  colors.backgroundTop,
  colors.background,
  colors.backgroundBottom
] as const;

export const surfaceGradient = {
  raised: [colors.surface2, colors.surface1] as const,
  sunken: [colors.backgroundBottom, colors.surface1] as const,
  accent: [colors.accentBright, colors.accent, colors.accentDim] as const,
  danger: [colors.danger, colors.dangerDim] as const,
  success: [colors.success, colors.successDim] as const,
  gold: [colors.goldBright, colors.gold, colors.goldDim] as const
} as const;

export const gradientEnds = {
  vertical: { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }
} as const;

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
  0.5: 2,
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

export const bubbleTailSize = 7;

export const seatRowGap = 2;

export const opacity = {
  muted: 0.85,
  disabled: 0.5
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
  xs: 12,
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

type ShadowInput = {
  alpha: number;
  blur: number;
  offsetY: number;
};

const shadow = ({ alpha, blur, offsetY }: ShadowInput) => ({
  boxShadow: `0px ${offsetY}px ${blur}px rgba(0, 0, 0, ${alpha})`
});

export const shadows = {
  card: shadow({ alpha: 0.35, blur: 8, offsetY: 3 }),
  cardRaised: shadow({ alpha: 0.45, blur: 18, offsetY: 8 }),
  panel: shadow({ alpha: 0.55, blur: 28, offsetY: 12 }),
  tile: shadow({ alpha: 0.3, blur: 5, offsetY: 2 }),
  button: shadow({ alpha: 0.4, blur: 8, offsetY: 3 })
} as const;

export const glow = {
  accent: { boxShadow: `0px 0px 12px ${colors.accentBright}` },
  trump: { boxShadow: `0px 0px 12px ${colors.trump}` },
  success: { boxShadow: `0px 0px 12px ${colors.success}` }
} as const;

export const card = {
  ratio: 2 / 3,
  radius: radii.card,
  overlap: -0.45
} as const;

export const duration = {
  fast: 140,
  layout: 180,
  card: 220,
  panel: 280
} as const;

export type Colors = typeof colors;
