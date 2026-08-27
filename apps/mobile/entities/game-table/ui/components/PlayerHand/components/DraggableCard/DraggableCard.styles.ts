import { StyleSheet } from 'react-native';

import { card as cardTokens } from '@/ui-kit';

const buildStyles = (width: number) =>
  StyleSheet.create({
    root: {
      width,
      height: width / cardTokens.ratio
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
