import { StyleSheet } from 'react-native';

import { colors } from '../../theme';

export const createStyles = (size: number, color: string) =>
  StyleSheet.create({
    ring: {
      width: size,
      height: size,
      borderWidth: Math.max(2, Math.round(size / 10)),

      borderColor: colors.border,
      borderTopColor: color,
      borderRadius: size / 2
    }
  });
