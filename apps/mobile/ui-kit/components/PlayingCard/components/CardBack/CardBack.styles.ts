import { StyleSheet } from 'react-native';

import type { CardTheme } from '../../../../theme';

import { radii } from '../../../../theme';

const DIAMOND_RATIO = 0.17;

const buildStyles = (width: number, theme: CardTheme) => {
  const diamond = width * DIAMOND_RATIO;
  const inset = width * 0.08;

  return StyleSheet.create({
    root: {
      flex: 1,
      overflow: 'hidden',
      backgroundColor: theme.back
    },

    grid: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'center',
      justifyContent: 'center',
      gap: diamond * 0.32,
      paddingHorizontal: inset
    },

    diamond: {
      width: diamond,
      height: diamond,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: theme.backPattern,
      opacity: 0.45,
      transform: [{ rotate: '45deg' }]
    },

    frame: {
      pointerEvents: 'none',
      position: 'absolute',
      inset: inset * 0.5,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: theme.backPattern,
      borderRadius: radii.card * 0.7,
      opacity: 0.55
    }
  });
};

const cache = new Map<string, ReturnType<typeof buildStyles>>();

export const createStyles = (width: number, theme: CardTheme) => {
  const key = `${width}:${theme.id}`;
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const styles = buildStyles(width, theme);

  cache.set(key, styles);

  return styles;
};
