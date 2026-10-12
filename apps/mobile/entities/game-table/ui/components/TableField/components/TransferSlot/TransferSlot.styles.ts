import { StyleSheet } from 'react-native';

import { borderWidth, card, colors, fontFamily, fontSize, glow, spacing } from '@/ui-kit';

export const createTransferStyles = (width: number, height: number) =>
  StyleSheet.create({
    root: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1],
      width,
      height,
      padding: spacing[1],
      borderWidth: borderWidth.regular,
      borderColor: colors.info,
      borderStyle: 'dashed',
      borderRadius: card.radius,
      backgroundColor: colors.glass
    },

    hovered: {
      backgroundColor: colors.glassStrong,
      ...glow.trump
    },

    label: {
      fontSize: fontSize.sm,
      fontFamily: fontFamily.sansBold,
      color: colors.onFelt,
      textAlign: 'center'
    }
  });
