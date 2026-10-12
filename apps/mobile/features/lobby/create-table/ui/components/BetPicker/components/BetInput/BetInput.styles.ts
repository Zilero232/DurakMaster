import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minWidth: 0
  },

  field: {
    flexShrink: 1,
    minWidth: 104,
    minHeight: TAP_TARGET,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderGold,
    borderRadius: radii.md,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.displayBold,
    color: colors.goldBright,
    textAlign: 'right',
    backgroundColor: colors.backgroundDeep
  },

  editing: {
    borderColor: colors.goldBright
  }
});
