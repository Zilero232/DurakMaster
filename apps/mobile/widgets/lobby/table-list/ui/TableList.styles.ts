import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  list: {
    gap: spacing[2],
    paddingBottom: spacing[4]
  },

  empty: {
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[4]
  },

  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt,
    textAlign: 'center'
  },

  emptyHint: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.onFeltMuted,
    textAlign: 'center'
  }
});
