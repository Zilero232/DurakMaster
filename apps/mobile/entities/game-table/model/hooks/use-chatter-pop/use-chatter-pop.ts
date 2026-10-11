import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import { FADE_MS, GROW_MS, HOLD_MS } from './use-chatter-pop.config';

export const useChatterPop = (id?: string) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (!id) {
      return;
    }

    scale.value = 0;
    scale.value = withSequence(
      withTiming(1, { duration: GROW_MS, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: HOLD_MS }),
      withTiming(0, { duration: FADE_MS, easing: Easing.in(Easing.quad) })
    );
  }, [id, scale]);

  return useAnimatedStyle(() => ({
    opacity: scale.value,
    transform: [{ scale: scale.value }]
  }));
};
