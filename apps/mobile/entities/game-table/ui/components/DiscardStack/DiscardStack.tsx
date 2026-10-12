import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { times } from 'remeda';

import { card, duration, PlayingCard } from '@/ui-kit';

import type { DiscardStackProps } from './DiscardStack.types';

import { CARD_OFFSET, DISCARD_TILT, discardLayout, VISIBLE_CARDS } from './DiscardStack.config';
import { styles } from './DiscardStack.styles';

export const DiscardStack = ({ cardWidth, count }: DiscardStackProps) => {
  if (count === 0) {
    return null;
  }

  const visible = Math.min(count, VISIBLE_CARDS);
  const layout = discardLayout({ cardWidth, cardHeight: cardWidth / card.ratio });

  return (
    <View style={[styles.root, layout.stack]}>
      {times(visible, (index) => (
        <Animated.View
          key={index}
          entering={FadeIn.duration(duration.fast)}
          style={[styles.card, { left: index * CARD_OFFSET }]}
        >
          <PlayingCard
            card={null}
            rotation={(index - visible / 2) * DISCARD_TILT}
            width={layout.card.width}
          />
        </Animated.View>
      ))}

      <Text style={styles.count}>{count}</Text>
    </View>
  );
};
