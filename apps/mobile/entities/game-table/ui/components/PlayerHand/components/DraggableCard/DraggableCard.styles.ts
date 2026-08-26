import { StyleSheet } from 'react-native';

import { card as cardTokens } from '@/ui-kit';

export const createStyles = (width: number) =>
  StyleSheet.create({
    root: {
      width,
      height: width / cardTokens.ratio
    }
  });
