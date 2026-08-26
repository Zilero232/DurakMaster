import { StyleSheet } from 'react-native';

import { colors, fontSize, spacing } from '@/ui-kit';

export const DISCARD_CARD_WIDTH = 44;

export const styles = StyleSheet.create({
  empty: {
    paddingVertical: spacing[6],
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  count: {
    marginBottom: spacing[2],
    fontSize: fontSize.sm,
    color: colors.mutedForeground
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    justifyContent: 'center'
  }
});
