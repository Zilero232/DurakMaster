import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 2,
    padding: spacing[1],
    borderRadius: radii.pill,
    backgroundColor: colors.surface2,
    ...shadows.tile
  },

  option: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    height: 44,
    borderRadius: radii.pill,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },

  optionActive: {
    backgroundColor: colors.surface1,
    ...shadows.tile
  },

  label: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  labelActive: {
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.accent
  }
});
