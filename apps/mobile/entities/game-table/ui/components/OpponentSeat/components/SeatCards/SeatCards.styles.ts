import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

import { BACK_STEP_X, backSize } from '../../OpponentSeat.styles';

export const styles = StyleSheet.create({
  cards: {
    width: backSize.width + BACK_STEP_X * 5,
    height: backSize.height
  },

  back: {
    position: 'absolute',
    top: 0,
    left: 0
  },

  ghostBack: {
    width: backSize.width,
    height: backSize.height,
    borderWidth: borderWidth.hairline,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: radii.card,
    backgroundColor: colors.glass
  },

  count: {
    position: 'absolute',
    right: 0,
    bottom: -2,
    minWidth: 22,
    paddingVertical: 2,
    paddingHorizontal: spacing[1],
    borderWidth: 2,
    borderColor: colors.surface1,
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.surface1,
    textAlign: 'center',
    backgroundColor: colors.accent,
    overflow: 'hidden'
  }
});
