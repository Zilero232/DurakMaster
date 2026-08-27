import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2],
    padding: spacing[4]
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radii.lg,
    backgroundColor: colors.surface1,
    ...shadows.card
  },

  main: {
    flex: 1,
    gap: spacing[2]
  }
});
