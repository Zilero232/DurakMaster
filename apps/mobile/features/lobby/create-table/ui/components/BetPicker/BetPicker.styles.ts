import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3]
  },

  label: {
    flexShrink: 0,
    fontSize: fontSize.md,
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  },

  value: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.goldBright
  },

  bounds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[1]
  },

  bound: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted
  }
});
