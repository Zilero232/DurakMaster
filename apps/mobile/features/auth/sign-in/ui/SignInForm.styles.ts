import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const CORNER_INSET = spacing[3];

const CARD_MAX_WIDTH = 480;

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  corner: {
    position: 'absolute',
    right: spacing[5],
    zIndex: 1
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6]
  },

  card: {
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
    lineHeight: 22,
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
