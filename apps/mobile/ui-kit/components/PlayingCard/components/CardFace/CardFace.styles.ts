import { StyleSheet } from 'react-native';

import { fontFamily } from '../../../../theme';

const buildStyles = (width: number) =>
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

const cache = new Map<number, ReturnType<typeof buildStyles>>();

export const createStyles = (width: number) => {
  const cached = cache.get(width);

  if (cached) {
    return cached;
  }

  const styles = buildStyles(width);

  cache.set(width, styles);

  return styles;
};
