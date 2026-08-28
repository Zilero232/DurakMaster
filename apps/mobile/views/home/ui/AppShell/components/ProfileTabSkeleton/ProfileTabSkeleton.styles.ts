import { StyleSheet } from 'react-native';

import { radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  content: {
    gap: spacing[3],
    padding: spacing[4]
  },

  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4]
  },

  column: {
    flex: 1,
    gap: spacing[3],
    minWidth: 0
  },

  card: {
    borderRadius: radii.lg
  }
});
