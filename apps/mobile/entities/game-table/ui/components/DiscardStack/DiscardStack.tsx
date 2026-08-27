import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { DiscardStackProps } from './DiscardStack.types';

import { CARD_OFFSET, discardCard, styles, VISIBLE_CARDS } from './DiscardStack.styles';

export const DiscardStack = ({ count }: DiscardStackProps) => {
  if (count === 0) {
    return null;
  }

  const visible = Math.min(count, VISIBLE_CARDS);

  return (
    <View style={styles.root}>
      {Array.from({ length: visible }, (_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.card,
            {
              width: discardCard.width,
              height: discardCard.height,
              left: index * CARD_OFFSET,
              transform: [{ rotate: `${(index - visible / 2) * 3}deg` }]
            }
          ]}
          entering={FadeIn.duration(160)}
        />
      ))}

      <Text style={styles.count}>{count}</Text>
    </View>
  );
};
