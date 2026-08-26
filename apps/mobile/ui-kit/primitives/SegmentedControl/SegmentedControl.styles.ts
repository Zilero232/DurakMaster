import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '../../theme';

export const MIN_TAP_SIZE = 44;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing[1],
    padding: spacing[1],
    borderRadius: radii.md,
    backgroundColor: colors.surface2
  },

  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TAP_SIZE - spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: radii.sm
  },

  optionActive: {
    backgroundColor: colors.accent
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
