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

import type { SeatChatterProps } from './SeatChatter.types';

import { styles } from './SeatChatter.styles';

const GROW_MS = 320;
const HOLD_MS = 1200;
const FADE_MS = 320;

const PEAK_RATIO = 0.78;

const isEmoji = (value: string): boolean => !/[\p{L}\p{N}]/u.test(value);

export const SeatChatter = ({ chatter, size }: SeatChatterProps) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (!chatter) {
      return;
    }

    scale.value = 0;
    scale.value = withSequence(
      withTiming(1, { duration: GROW_MS, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: HOLD_MS }),
      withTiming(0, { duration: FADE_MS, easing: Easing.in(Easing.quad) })
    );
  }, [chatter, scale]);

  const grow = useAnimatedStyle(() => ({
    opacity: scale.value,
    transform: [{ scale: scale.value }]
  }));

  if (!chatter) {
    return null;
  }

  if (isEmoji(chatter)) {
    return (
      <Animated.View key={chatter} style={[styles.emoji, grow]}>
        <Text style={{ fontSize: size * PEAK_RATIO }}>{chatter}</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      key={chatter}
      entering={FadeIn.duration(160)}
      exiting={FadeOut.duration(240)}
      style={styles.bubble}
    >
      <Text numberOfLines={1} style={styles.bubbleText}>
        {chatter}
      </Text>
    </Animated.View>
  );
};
