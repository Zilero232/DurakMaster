import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3],
    padding: spacing[4],
    paddingBottom: spacing[8]
  },

  /**
   * The form is long enough that a single column means scrolling past the game picker to
   * reach the submit button. On desktop the two halves sit side by side instead.
   */
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
