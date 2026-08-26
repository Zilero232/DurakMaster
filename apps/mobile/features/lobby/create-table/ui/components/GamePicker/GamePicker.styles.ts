import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  },

  card: {
    flexGrow: 1,
    flexBasis: '47%',
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[3],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface2
  },

  active: {
    borderColor: colors.accent,
    backgroundColor: colors.surface3
  },

  unavailable: {
    opacity: 0.45
  },

  pressed: {
    opacity: 0.75
  },

  name: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  nameActive: {
    color: colors.accent
  },

  hint: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.subtleForeground,
    textAlign: 'center'
  }
});
