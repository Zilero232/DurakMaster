import { Text, View } from 'react-native';

import type { CardFaceProps } from './CardFace.types';

import { JokerIcon, SuitIcon } from '../../../../icons';
import { rankLabel, suitColor } from '../../../../theme';
import { createStyles } from './CardFace.styles';

export const CardFace = ({ card, width, theme }: CardFaceProps) => {
  const styles = createStyles(width);

  if (card.joker) {
    const jokerColor = suitColor(theme, card.joker === 'red' ? 'hearts' : 'spades');

    return (
      <View style={styles.root}>
        <View style={styles.corner}>
          <JokerIcon color={jokerColor} size={width * 0.24} />
        </View>

        <JokerIcon color={jokerColor} size={width * 0.46} style={styles.center} />
      </View>
    );
  }

  const color = suitColor(theme, card.suit);

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
