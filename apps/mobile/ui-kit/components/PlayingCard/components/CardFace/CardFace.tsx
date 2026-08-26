import { Text, View } from 'react-native';

import type { CardFaceProps } from './CardFace.types';

import { SuitIcon } from '../../../../icons';
import { isRedSuit, rankLabel } from '../../../../lib';
import { createStyles } from './CardFace.styles';

export const CardFace = ({ card, width, theme }: CardFaceProps) => {
  const styles = createStyles(width);
  const color = isRedSuit(card.suit) ? theme.red : theme.black;

  return (
    <View style={styles.root}>
      <View style={styles.corner}>
        <Text allowFontScaling={false} numberOfLines={1} style={[styles.rank, { color }]}>
          {rankLabel(card.rank)}
        </Text>

        <SuitIcon color={color} size={width * 0.19} suit={card.suit} />
      </View>

      <SuitIcon color={color} size={width * 0.46} style={styles.center} suit={card.suit} />
    </View>
  );
};
