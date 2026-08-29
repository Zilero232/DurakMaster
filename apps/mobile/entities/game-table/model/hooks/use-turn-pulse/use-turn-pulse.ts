import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const PULSE_MS = 900;

const PULSE_SCALE = 1.035;

export const useTurnPulse = (isActive: boolean, isStatic = false) => {
  const scale = useSharedValue(1);

  const isPulsing = isActive && !isStatic;

  useEffect(() => {
    if (!isPulsing) {
      scale.value = withTiming(1, { duration: PULSE_MS / 2 });

      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(PULSE_SCALE, { duration: PULSE_MS, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [isPulsing, scale]);

  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
};
