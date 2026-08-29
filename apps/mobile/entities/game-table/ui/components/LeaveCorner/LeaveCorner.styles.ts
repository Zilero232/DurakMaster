import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, lineHeight, radii, spacing } from '@/ui-kit';

const SIZE = 40;

export const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glassStrong
  },

  pressed: {
    backgroundColor: colors.glass
  },

  dialog: {
    gap: spacing[4],
    paddingBottom: spacing[2]
  },

  hint: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal(fontSize.md),
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  },

  actions: {
    flexDirection: 'row',
    gap: spacing[3]
  },

  action: {
    flex: 1
  }
});
