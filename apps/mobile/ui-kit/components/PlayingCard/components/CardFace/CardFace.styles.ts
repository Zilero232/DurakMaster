import { StyleSheet } from 'react-native';

import { fontFamily } from '../../../../theme';

export const createStyles = (width: number) =>
  StyleSheet.create({
    root: {
      flex: 1,
      padding: width * 0.07
    },

    corner: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: width * 0.01
    },

    rank: {
      fontSize: width * 0.27,
      fontWeight: '800',
      fontFamily: fontFamily.sansBold,
      lineHeight: width * 0.29,
      letterSpacing: -width * 0.012
    },

    center: {
      position: 'absolute',
      right: width * 0.08,
      bottom: width * 0.08,
      opacity: 0.9
    }
  });
