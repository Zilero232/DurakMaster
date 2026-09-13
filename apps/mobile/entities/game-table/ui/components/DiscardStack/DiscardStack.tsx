import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { times } from 'remeda';

import type { DiscardStackProps } from './DiscardStack.types';

import { useCardSize } from '../../../model';
import { CARD_OFFSET, discardLayout, VISIBLE_CARDS } from './DiscardStack.config';
import { styles } from './DiscardStack.styles';

export const DiscardStack = ({ count }: DiscardStackProps) => {
  const card = useCardSize();

  if (count === 0) {
    return null;
  }

  const visible = Math.min(count, VISIBLE_CARDS);
  const layout = discardLayout({ cardWidth: card.width, cardHeight: card.height });

  return (
    <View style={[styles.root, layout.stack]}>
      {times(visible, (index) => (
        <Animated.View
          key={index}
          style={[
            styles.card,
            layout.card,
            {
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
