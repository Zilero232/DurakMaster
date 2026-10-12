import { StyleSheet } from 'react-native';

import { colors, radii, shadows } from '@/ui-kit';

export const createStyles = (size: number) =>
  StyleSheet.create({
    root: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size
    },

    glow: {
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: radii.pill,
      backgroundColor: colors.goldBright
    },

    disc: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size * 0.82,
      height: size * 0.82,
      borderWidth: 3,
      borderColor: colors.goldBright,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
      ...shadows.cardRaised
    }
  });
