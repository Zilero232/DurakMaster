import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    padding: spacing[1],
    borderRadius: radii.pill,
    borderWidth: borderWidth.regular,
    borderColor: colors.transparent
  },

  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.glass
  },

  pressed: {
    opacity: 0.7
  }
});
