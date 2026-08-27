import type { TextStyle, ViewStyle } from 'react-native';

import { StyleSheet } from 'react-native';

import type { ButtonSize, ButtonVariant } from './Button.types';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '../../theme';

type StylePair = {
  container: ViewStyle;
  label: TextStyle;
};

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.transparent,
    borderRadius: radii.md,
    ...shadows.button
  },

  fullWidth: {
    width: '100%'
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }]
  },

  disabled: {
    opacity: 0.45,
    boxShadow: 'none',
    elevation: 0
  },

  label: {
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    textAlign: 'center'
  }
});

export const VARIANT_SPINNER_COLOR: Record<ButtonVariant, string> = {
  primary: colors.primaryForeground,
  secondary: colors.foreground,
  ghost: colors.onFelt,
  danger: colors.primaryForeground
};

export const VARIANT_STYLES: Record<ButtonVariant, StylePair> = {
  primary: {
    container: { backgroundColor: colors.primary },
    label: { color: colors.primaryForeground }
  },
  secondary: {
    container: { backgroundColor: colors.surface1, borderColor: colors.border },
    label: { color: colors.foreground }
  },
  ghost: {
    container: { backgroundColor: 'rgba(255, 255, 255, 0.14)', borderColor: colors.glassBorder },
    label: { color: colors.onFelt }
  },
  danger: {
    container: { backgroundColor: colors.danger },
    label: { color: colors.primaryForeground }
  }
};

export const SIZE_STYLES: Record<ButtonSize, StylePair> = {
  sm: {
    container: { minHeight: 36, paddingHorizontal: spacing[3] },
    label: { fontSize: fontSize.sm }
  },
  default: {
    container: { minHeight: 48, paddingHorizontal: spacing[4] },
    label: { fontSize: fontSize.md }
  },
  lg: {
    container: { minHeight: 56, paddingHorizontal: spacing[5] },
    label: { fontSize: fontSize.lg }
  }
};
