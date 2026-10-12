import { StyleSheet } from 'react-native';

import {
  BET_COLUMN_MIN_WIDTH,
  colors,
  DOT_SIZE,
  fontFamily,
  fontSize,
  lineHeight,
  radii,
  spacing
} from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    gap: spacing[2],
    minWidth: BET_COLUMN_MIN_WIDTH
  },

  bet: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.displayBold,
    lineHeight: lineHeight.tight(fontSize.xl),
    color: colors.gold
  },

  seats: {
    flexDirection: 'row',
    gap: spacing[1]
  },

  seat: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3
  },

  taken: {
    backgroundColor: colors.success
  }
});
