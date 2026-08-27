import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  emoji: {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  bubble: {
    pointerEvents: 'none',
    position: 'absolute',
    bottom: '100%',
    alignSelf: 'center',
    marginBottom: spacing[2],

    minWidth: 120,
    maxWidth: 260,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    backgroundColor: colors.surface1,
    ...shadows.cardRaised
  },

  bubbleText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground,
    textAlign: 'center'
  }
});
