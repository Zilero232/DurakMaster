import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, shadows, spacing } from '@/ui-kit';

const BET_COLUMN_WIDTH = 76;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2],
    padding: spacing[4]
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface1,
    ...shadows.card
  },

  betColumn: {
    alignItems: 'flex-start',
    gap: spacing[1],
    minWidth: BET_COLUMN_WIDTH
  },

  main: {
    flex: 1,
    gap: spacing[2]
  }
});
