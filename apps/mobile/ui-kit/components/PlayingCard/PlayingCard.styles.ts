import { StyleSheet } from 'react-native';

import type { CardTheme } from '../../theme';

import { card as cardTokens, colors, shadows } from '../../theme';

const SELECTED_LIFT_RATIO = 0.09;

export const getSelectedLift = (width: number): number =>
  -(width / cardTokens.ratio) * SELECTED_LIFT_RATIO;

export const createStyles = (width: number, theme: CardTheme) =>
  StyleSheet.create({
    root: {
      width,
      height: width / cardTokens.ratio,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.border,
      borderRadius: cardTokens.radius,
      backgroundColor: theme.face,
      ...shadows.card
    },

    selected: {
      borderColor: theme.accent,
      ...shadows.cardRaised
    },

    dimmed: {
      opacity: 0.45
    },

    playableRing: {
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      borderWidth: 2,
      borderColor: theme.accent,
      borderRadius: cardTokens.radius,
      opacity: 0.85
    }
  });
