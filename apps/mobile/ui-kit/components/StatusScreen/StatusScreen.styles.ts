import type { TextStyle } from 'react-native';

import { Platform, StyleSheet } from 'react-native';

import type { StatusScreenTone } from './StatusScreen.types';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '../../theme';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5]
  },

  panel: {
    alignItems: 'center',
    gap: spacing[3],
    width: '100%',
    maxWidth: 420,
    padding: spacing[6],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    borderRadius: radii.xl,
    backgroundColor: colors.surface1,
    ...shadows.panel
  },

  icon: {
    marginBottom: spacing[1]
  },

  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  description: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  highlight: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    textAlign: 'center'
  },

  details: {
    alignSelf: 'stretch',
    padding: spacing[3],
    borderRadius: radii.sm,
    fontSize: fontSize.xs,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    color: colors.subtleForeground,
    backgroundColor: colors.surface2
  },

  actions: {
    gap: spacing[2],
    alignSelf: 'stretch',
    marginTop: spacing[2]
  }
});

export const TONE_STYLES: Record<StatusScreenTone, TextStyle> = {
  gain: { color: colors.success },
  loss: { color: colors.danger },
  neutral: { color: colors.foreground }
};
