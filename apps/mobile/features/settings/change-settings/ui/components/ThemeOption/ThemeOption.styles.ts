import { StyleSheet } from 'react-native';

import { card, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const PREVIEW_CARD_WIDTH = 38;

const PREVIEW_CARD_HEIGHT = PREVIEW_CARD_WIDTH / card.ratio;

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    flexBasis: '47%',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface1
  },

  active: {
    borderColor: colors.borderGold,
    backgroundColor: colors.surface2
  },

  pressed: {
    opacity: 0.7
  },

  preview: {
    pointerEvents: 'none',
    flexDirection: 'row',
    justifyContent: 'center',
    height: PREVIEW_CARD_HEIGHT + spacing[2]
  },

  back: {
    transform: [{ rotate: '-9deg' }]
  },

  face: {
    marginLeft: -PREVIEW_CARD_WIDTH / 2,
    transform: [{ rotate: '7deg' }]
  },

  name: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground
  },

  activeName: {
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.gold
  }
});
