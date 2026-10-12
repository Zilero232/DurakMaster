import type { TextStyle, ViewStyle } from 'react-native';

import { StyleSheet } from 'react-native';

import type { ButtonSize, ButtonVariant } from './Button.types';

import {
  colors,
  fontFamily,
  fontSize,
  opacity,
  radii,
  shadows,
  spacing,
  surfaceGradient
} from '../../theme';

type StylePair = {
  container: ViewStyle;
  label: TextStyle;
};

type SizeStyles = StylePair & {
  iconOnly: ViewStyle;
};

export const VARIANT_GRADIENT: Record<
  ButtonVariant,
  readonly [string, string, ...string[]] | null
> = {
  primary: surfaceGradient.accent,
  secondary: surfaceGradient.raised,
  ghost: null,
  danger: surfaceGradient.danger
};

export const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minWidth: 0
  },

  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.transparent,
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.button
  },

  fill: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  sheen: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: colors.glass
  },

  fullWidth: {
    width: '100%'
  },

  pressed: {
    opacity: opacity.muted,
    transform: [{ scale: 0.97 }]
  },

  disabled: {
    opacity: opacity.disabled,
    boxShadow: 'none'
  },

  label: {
    fontFamily: fontFamily.sansBold,
    textAlign: 'center'
  }
});

export const VARIANT_FOREGROUND: Record<ButtonVariant, string> = {
  primary: colors.primaryForeground,
  secondary: colors.foreground,
  ghost: colors.onFelt,
  danger: colors.foreground
};

export const VARIANT_STYLES: Record<ButtonVariant, StylePair> = {
  primary: {
    container: { backgroundColor: colors.primary, borderColor: colors.borderGold },
    label: { color: colors.primaryForeground }
  },
  secondary: {
    container: { backgroundColor: colors.surface1, borderColor: colors.borderStrong },
    label: { color: colors.foreground }
  },
  ghost: {
    container: { backgroundColor: colors.glassStrong, borderColor: colors.glassBorder },
    label: { color: colors.onFelt }
  },
  danger: {
    container: { backgroundColor: colors.danger },
    label: { color: colors.foreground }
  }
};

export const SIZE_STYLES: Record<ButtonSize, SizeStyles> = {
  sm: {
    container: { minHeight: 36, paddingHorizontal: spacing[3] },
    iconOnly: { width: 36, height: 36, flexGrow: 0, flexShrink: 0 },
    label: { fontSize: fontSize.sm }
  },
  default: {
    container: { minHeight: 48, paddingHorizontal: spacing[4] },
    iconOnly: { width: 48, height: 48, flexGrow: 0, flexShrink: 0 },
    label: { fontSize: fontSize.md }
  },
  lg: {
    container: { minHeight: 56, paddingHorizontal: spacing[5] },
    iconOnly: { width: 56, height: 56, flexGrow: 0, flexShrink: 0 },
    label: { fontSize: fontSize.lg }
  }
};
