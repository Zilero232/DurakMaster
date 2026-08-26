import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minHeight: 96,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    backgroundColor: colors.border
  },

  pressed: {
    backgroundColor: colors.glassBorder
  },

  locked: {
    opacity: 0.55
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  badge: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.goldBright
  },

  label: {
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt,
    textAlign: 'center'
  },

  soon: {
    fontSize: 10,
    color: colors.onFeltMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  }
});
