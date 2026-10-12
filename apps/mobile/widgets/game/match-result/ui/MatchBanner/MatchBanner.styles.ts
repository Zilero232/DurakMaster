import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  scrim: {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.scrimStrong
  },

  center: {
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[6]
  },

  title: {
    fontSize: fontSize.display,
    fontFamily: fontFamily.displayBold,
    color: colors.foreground,
    textAlign: 'center',
    textShadowColor: colors.backgroundDeep,
    textShadowRadius: 12
  },

  titleLoser: {
    color: colors.danger
  },

  titleWin: {
    color: colors.goldBright
  },

  deltas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2]
  },

  hint: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
