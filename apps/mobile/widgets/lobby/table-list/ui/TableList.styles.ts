import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  list: {
    gap: spacing[2],
    padding: spacing[4],
    paddingBottom: spacing[8]
  },

  cell: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing[1]
  },

  desktopList: {
    gap: spacing[2],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[8]
  },

  empty: {
    alignItems: 'center',
    gap: spacing[3],
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
    marginBottom: spacing[2],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.relaxed(fontSize.sm),
    color: colors.onFeltMuted,
    textAlign: 'center'
  },

  emptyAction: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.primaryForeground
  }
});
