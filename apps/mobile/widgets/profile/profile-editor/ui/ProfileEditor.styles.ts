import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5]
  },

  section: {
    gap: spacing[3]
  },

  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    color: colors.foreground
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  }
});
