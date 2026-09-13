import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

const CARD_MAX_WIDTH = 480;

const SUBTITLE_LINE_HEIGHT = 22;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5],
    padding: spacing[8],
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
    alignSelf: 'center',
    borderRadius: radii.xl
  },

  logo: {
    alignSelf: 'center'
  },

  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  subtitle: {
    marginBottom: spacing[2],
    fontSize: fontSize.md,
    lineHeight: SUBTITLE_LINE_HEIGHT,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  error: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.accent
  },

  switch: {
    padding: spacing[2],
    fontSize: fontSize.md,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
