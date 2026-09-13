import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  card: {
    position: 'absolute',
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.card,
    backgroundColor: colors.feltEdge
  },

  count: {
    position: 'absolute',
    right: -spacing[1],
    bottom: -spacing[1],
    minWidth: 22,
    paddingHorizontal: spacing[1],
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    lineHeight: 22,
    color: colors.onFelt,
    textAlign: 'center',
    backgroundColor: colors.backgroundDeep
  }
});
