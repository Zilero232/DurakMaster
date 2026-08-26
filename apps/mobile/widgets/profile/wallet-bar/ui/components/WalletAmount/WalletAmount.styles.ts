import { StyleSheet } from 'react-native';

import { colors, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[2]
  },

  amount: {
    minWidth: 64,
    fontSize: fontSize.lg,
    color: colors.accent,
    textAlign: 'right'
  },

  topUp: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: colors.borderAccent,
    borderRadius: radii.sm
  },

  pressed: {
    opacity: 0.6
  }
});
