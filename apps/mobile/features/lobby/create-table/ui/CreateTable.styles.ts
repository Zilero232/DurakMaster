import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  content: {
    gap: spacing[3],
    padding: spacing[4],
    paddingBottom: spacing[6]
  },

  footer: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.glassBorder
  }
});
