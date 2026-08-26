import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[4]
  },

  quickGame: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    padding: spacing[5],
    borderRadius: radii.lg,
    backgroundColor: colors.glassBorder
  },

  quickGamePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },

  quickGameLabel: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  grid: {
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radii.lg
  }
});
