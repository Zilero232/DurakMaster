import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { EnterMotionInput } from './use-enter-motion.types';

import { ENTER_SCALE } from './use-enter-motion.config';

export const useEnterMotion = ({ offsetY, durationMs, isInstant = false }: EnterMotionInput) => {
  const progress = useSharedValue(isInstant ? 1 : 0);

  useEffect(() => {
    if (isInstant) {
      progress.value = 1;

      return;
    }

    progress.value = withTiming(1, { duration: durationMs, easing: Easing.out(Easing.cubic) });
  }, [durationMs, isInstant, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: offsetY * (1 - progress.value) },
      { scale: ENTER_SCALE + (1 - ENTER_SCALE) * progress.value }
    ]
  }));
};
