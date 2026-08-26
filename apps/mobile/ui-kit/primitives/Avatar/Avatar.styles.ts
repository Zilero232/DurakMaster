import { StyleSheet } from 'react-native';

import { colors } from '../../theme';

export const createStyles = (size: number) =>
  StyleSheet.create({
    root: {
      width: size,
      height: size,
      overflow: 'hidden',
      borderRadius: size / 2,
      backgroundColor: colors.surface3
    },

    image: {
      width: '100%',
      height: '100%'
    }
  });
