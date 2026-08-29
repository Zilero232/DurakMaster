import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const RAIL_WIDTH = 260;

export const styles = StyleSheet.create({
  root: {
    width: RAIL_WIDTH,
    gap: spacing[6],
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    borderRightWidth: borderWidth.hairline,
    borderRightColor: colors.glassBorder
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[3]
  },

  brandName: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  brandSubtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.gold,
    letterSpacing: 1
  },

  nav: {
    gap: spacing[1]
  },

  footer: {
    marginTop: 'auto',
    gap: spacing[3]
  },

  status: {
    paddingHorizontal: spacing[3],
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  signOut: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.md
  },

  signOutPressed: {
    backgroundColor: colors.glass
  },

  signOutLabel: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFelt
  }
});
