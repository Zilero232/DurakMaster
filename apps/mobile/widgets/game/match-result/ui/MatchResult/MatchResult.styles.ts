import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const SCREEN_GAP = spacing[6];

export const styles = StyleSheet.create({
  root: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5]
  },

  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3]
  },

  title: {
    fontSize: fontSize.display,
    fontFamily: fontFamily.displayBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  description: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal(fontSize.md),
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  deltas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[3]
  },

  actions: {
    gap: spacing[3]
  }
});
