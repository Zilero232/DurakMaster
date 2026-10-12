import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, spacing, TAP_TARGET } from '@/ui-kit';

export const AVATAR_SIZE = TAP_TARGET - spacing[2];

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3]
  },

  avatarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TAP_TARGET,
    height: TAP_TARGET,
    borderRadius: radii.pill
  },

  avatarPressed: {
    backgroundColor: colors.glass
  },

  avatarRing: {
    borderWidth: borderWidth.regular,
    borderColor: colors.borderGold,
    borderRadius: radii.pill
  },

  middle: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center'
  },

  balances: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexShrink: 0
  }
});
