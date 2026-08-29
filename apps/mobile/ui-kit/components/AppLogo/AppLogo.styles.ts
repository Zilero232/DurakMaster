import { StyleSheet } from 'react-native';

import { colors, radii } from '../../theme';

const CARD_TILT = '-12deg';

export const createStyles = (size: number) =>
  StyleSheet.create({
    root: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size
    },

    card: {
      position: 'absolute',
      width: size * 0.62,
      height: size * 0.84,
      borderRadius: radii.xs,
      backgroundColor: colors.onFelt,
      transform: [{ rotate: CARD_TILT }, { translateX: size * 0.06 }]
    }
  });
