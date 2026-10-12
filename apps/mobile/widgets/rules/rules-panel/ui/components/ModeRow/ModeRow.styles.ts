import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, radii, spacing } from '@/ui-kit';

const ICON_TILE = 48;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3]
  },

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_TILE,
    height: ICON_TILE,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundBottom
  },

  body: {
    flex: 1,
    gap: spacing[1]
  },

  title: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  text: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.relaxed(fontSize.sm),
    color: colors.mutedForeground
  }
});
