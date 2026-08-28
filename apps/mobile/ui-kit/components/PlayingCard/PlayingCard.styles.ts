import { StyleSheet } from 'react-native';

import type { CardTheme } from '../../theme';

import { borderWidth, card as cardTokens } from '../../theme';

const SELECTED_LIFT_RATIO = 0.09;

export const getSelectedLift = (width: number): number =>
  -(width / cardTokens.ratio) * SELECTED_LIFT_RATIO;

const buildStyles = (width: number, theme: CardTheme) =>
  StyleSheet.create({
    root: {
      width,
      height: width / cardTokens.ratio,
      overflow: 'hidden',

      borderWidth: borderWidth.hairline,
      borderColor: theme.edge,
      borderRadius: cardTokens.radius,
      backgroundColor: theme.face
    },

    selected: {
      borderColor: theme.accent
    },

    dimmed: {
      backgroundColor: theme.faceDimmed
    },

    playableRing: {
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      borderWidth: 2,
      borderColor: theme.accent,
      borderRadius: cardTokens.radius
    }
  });

const cache = new Map<string, ReturnType<typeof buildStyles>>();

export const createStyles = (width: number, theme: CardTheme) => {
  const key = `${width}:${theme.id}`;
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const styles = buildStyles(width, theme);

  cache.set(key, styles);

  return styles;
};
