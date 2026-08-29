import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minHeight: 74,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.transparent,
    borderRadius: radii.md,
    backgroundColor: colors.surface1,
    ...shadows.tile
  },

  active: {
    borderColor: colors.accent,
    backgroundColor: colors.surface2
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }]
  },

  labelActive: {
    color: colors.accent
  },

  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    lineHeight: 16,
    color: colors.foreground,
    textAlign: 'center'
  },

  hint: {
    fontSize: fontSize.xs,
    lineHeight: 14,
    color: colors.subtleForeground,
    textAlign: 'center'
  }
});
