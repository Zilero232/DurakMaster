import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing[2]
  },

  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.surface1
  },

  active: {
    borderColor: colors.borderGold,
    backgroundColor: colors.surface2
  },

  pressed: {
    opacity: 0.7
  },

  label: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground
  },

  activeLabel: {
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.gold
  }
});
