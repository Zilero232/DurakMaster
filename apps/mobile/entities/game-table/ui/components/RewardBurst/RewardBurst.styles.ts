import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },

  card: {
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radii.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderGold,
    backgroundColor: colors.scrim,
    ...shadows.panel
  },

  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  value: {
    fontSize: fontSize.display,
    fontFamily: fontFamily.displayBold,
    color: colors.gold
  },

  loss: {
    color: colors.danger
  },

  rating: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted
  }
});
