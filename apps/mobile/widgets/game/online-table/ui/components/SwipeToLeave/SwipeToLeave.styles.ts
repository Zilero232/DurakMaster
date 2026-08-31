import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, iconSize, spacing } from '@/ui-kit';

export const HINT_WIDTH = iconSize.xl + spacing[4] * 2;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundDeep
  },

  hint: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    width: HINT_WIDTH
  },

  hintLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.onFeltMuted,
    textAlign: 'center'
  },

  table: {
    flex: 1
  }
});
