import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '../../theme';

export const MIN_TAP_SIZE = 44;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing[1],
    padding: spacing[1],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundBottom
  },

  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TAP_SIZE - spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: radii.sm,
    overflow: 'hidden'
  },

  optionActive: {
    backgroundColor: colors.accent,
    ...shadows.tile
  },

  fill: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  labelActive: {
    color: colors.primaryForeground
  }
});
