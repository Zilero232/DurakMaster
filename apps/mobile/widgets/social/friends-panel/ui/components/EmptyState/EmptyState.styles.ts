import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, lineHeight, radii, spacing } from '@/ui-kit';

const ICON_CIRCLE = 72;

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4]
  },

  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    marginBottom: spacing[1],
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surface2
  },

  title: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  hint: {
    maxWidth: 280,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.relaxed(fontSize.sm),
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
