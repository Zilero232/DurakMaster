import { View } from 'react-native';

import type { CardBackProps } from './CardBack.types';

import { CELLS } from './CardBack.config';
import { createStyles } from './CardBack.styles';

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
