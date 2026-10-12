import { StyleSheet } from 'react-native';

import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  ICON_TILE_SIZE,
  lineHeight,
  radii,
  spacing
} from '@/ui-kit';

export const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    gap: spacing[3],
    paddingBottom: spacing[2]
  },

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_TILE_SIZE,
    height: ICON_TILE_SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderGold,
    borderRadius: radii.lg,
    backgroundColor: colors.glassStrong
  },

  hint: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal(fontSize.md),
    fontFamily: fontFamily.sans,
    color: colors.foreground,
    textAlign: 'center'
  },

  balance: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.gold
  },

  blocker: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.danger,
    textAlign: 'center'
  },

  actions: {
    flexDirection: 'row',
    gap: spacing[3]
  },

  action: {
    flex: 1
  }
});
