import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4]
  },

  title: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt,
    textAlign: 'center'
  },

  hint: {
    marginBottom: spacing[2],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.relaxed(fontSize.sm),
    color: colors.onFeltMuted,
    textAlign: 'center'
  }
});
