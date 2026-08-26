import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },

  content: {
    flex: 1
  },

  profile: {
    gap: spacing[3],
    padding: spacing[4],
    paddingBottom: spacing[8]
  }
});
