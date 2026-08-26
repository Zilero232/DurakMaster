import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexBasis: '48%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minHeight: 94,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderWidth: 2,
    borderColor: colors.transparent,
    borderRadius: radii.md,
    backgroundColor: colors.surface1,
    ...shadows.tile
  },

  active: {
    borderColor: colors.accent
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }]
  },

  check: {
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.accent
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
