import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, iconSize, spacing } from '@/ui-kit';

export const RULE_ICON_SIZE = iconSize.sm;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  deck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1]
  },

  deckSize: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  }
});
