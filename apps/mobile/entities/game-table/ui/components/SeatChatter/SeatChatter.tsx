import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { duration, TauntIcon } from '@/ui-kit';

import type { SeatChatterProps } from './SeatChatter.types';

import { useChatterPop } from '../../../model';
import { PEAK_RATIO } from './SeatChatter.config';
import { BELOW_CLEARANCE, styles } from './SeatChatter.styles';

export const SeatChatter = ({
  chatter,
  size,
  arcLift = 0,
  placement = 'above',
  clearance = 0
}: SeatChatterProps) => {
  const grow = useChatterPop(chatter?.id);

  if (!chatter) {
    return null;
  }

  if (chatter.kind === 'taunt') {
    return (
      <Animated.View key={chatter.id} style={[styles.emoji, grow]}>
        <TauntIcon size={size * PEAK_RATIO} taunt={chatter.taunt} />
      </Animated.View>
    );
  }

  const isAbove = placement === 'above';

  return (
    <Animated.View
      key={chatter.id}
      style={[
        styles.bubble,
        isAbove ? styles.above : styles.below,
        !isAbove && { marginTop: clearance + BELOW_CLEARANCE },
        { transform: [{ translateY: arcLift }] }
      ]}
      entering={FadeIn.duration(duration.fast)}
      exiting={FadeOut.duration(duration.card)}
    >
      <Text numberOfLines={1} style={styles.bubbleText}>
        {chatter.text}
      </Text>

      <View style={[styles.tail, isAbove ? styles.tailAbove : styles.tailBelow]} />
    </Animated.View>
  );
};
