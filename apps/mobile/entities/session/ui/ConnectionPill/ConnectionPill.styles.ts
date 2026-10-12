import { StyleSheet } from 'react-native';

import {
  borderWidth,
  colors,
  DOT_SIZE,
  fontFamily,
  fontSize,
  radii,
  shadows,
  spacing
} from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderAccent,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceOverlay,
    ...shadows.tile
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radii.pill
  },

  connecting: {
    backgroundColor: colors.accent
  },

  offline: {
    backgroundColor: colors.danger
  },

  label: {
    flexShrink: 1,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  }
});
