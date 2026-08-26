import { View } from 'react-native';

import type { CardBackProps } from './CardBack.types';

import { createStyles } from './CardBack.styles';

const COLUMNS = 4;
const ROWS = 6;

const CELLS = Array.from({ length: COLUMNS * ROWS }, (_, index) => index);

export const CardBack = ({ width, theme }: CardBackProps) => {
  const styles = createStyles(width, theme);

  return (
    <View style={styles.root}>
      <View style={styles.grid}>
        {CELLS.map((index) => (
          <View key={index} style={styles.diamond} />
        ))}
      </View>

      <View style={styles.frame} />
    </View>
  );
};
