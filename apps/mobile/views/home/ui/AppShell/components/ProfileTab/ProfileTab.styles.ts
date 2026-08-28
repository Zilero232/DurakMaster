import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  content: {
    gap: spacing[3],
    padding: spacing[4],
    paddingBottom: spacing[8]
  },

  /** Desktop splits the tab: identity and stats on the left, the menu on the right. */
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4]
  },

  column: {
    flex: 1,
    gap: spacing[3],
    minWidth: 0
  }
});
