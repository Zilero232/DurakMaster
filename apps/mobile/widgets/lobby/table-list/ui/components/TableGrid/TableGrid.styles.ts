import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  list: {
    gap: spacing[2],
    padding: spacing[4],
    paddingBottom: spacing[8]
  },

  desktopList: {
    gap: spacing[2],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[8]
  },

  cell: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing[1]
  }
});
