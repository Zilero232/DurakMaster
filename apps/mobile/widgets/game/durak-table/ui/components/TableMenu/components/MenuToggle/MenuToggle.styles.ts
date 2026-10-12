import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, opacity, spacing, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: TAP_TARGET
  },

  pressed: {
    opacity: opacity.muted
  },

  label: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  }
});
