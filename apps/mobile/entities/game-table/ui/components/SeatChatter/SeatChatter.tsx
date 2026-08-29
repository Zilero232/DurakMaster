import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import { TauntIcon } from '@/ui-kit';

import type { SeatChatterProps } from './SeatChatter.types';

import { styles } from './SeatChatter.styles';

const GROW_MS = 320;
const HOLD_MS = 1200;
const FADE_MS = 320;

const PEAK_RATIO = 0.78;

export const SeatChatter = ({ chatter, size, placement = 'above' }: SeatChatterProps) => {
  const scale = useSharedValue(0);

  const sentAt = chatter?.sentAt;

  useEffect(() => {
    if (!sentAt) {
      return;
    }

    scale.value = 0;
    scale.value = withSequence(
      withTiming(1, { duration: GROW_MS, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: HOLD_MS }),
      withTiming(0, { duration: FADE_MS, easing: Easing.in(Easing.quad) })
    );
  }, [sentAt, scale]);

  const grow = useAnimatedStyle(() => ({
    opacity: scale.value,
    transform: [{ scale: scale.value }]
  }));

  if (!chatter) {
    return null;
  }

  if (chatter.kind === 'taunt') {
    return (
      <Animated.View key={chatter.sentAt} style={[styles.emoji, grow]}>
        <TauntIcon size={size * PEAK_RATIO} taunt={chatter.taunt} />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      key={chatter.sentAt}
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(240)}
      style={[styles.bubble, placement === 'above' ? styles.above : styles.below]}
    >
      <Text numberOfLines={1} style={styles.bubbleText}>
        {chatter.text}
      </Text>
    </Animated.View>
  );
};
