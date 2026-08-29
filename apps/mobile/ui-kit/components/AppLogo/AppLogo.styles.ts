import { StyleSheet } from 'react-native';

import { colors, radii } from '../../theme';

const CARD_TILT = '-12deg';

const CARD_SHIFT = 0.06;

export const createStyles = (size: number) =>
  StyleSheet.create({
    root: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size
    },

    card: {
      width: size * 0.62,
      height: size * 0.84,
      borderRadius: radii.xs,
      backgroundColor: colors.onFelt,
      transform: [{ rotate: CARD_TILT }, { translateX: size * CARD_SHIFT }]
    },

    suit: {
      position: 'absolute',
      transform: [{ translateX: size * CARD_SHIFT }]
    }
  });
