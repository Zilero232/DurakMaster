import { useEffect } from 'react';
import { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { clamp } from 'remeda';

import { useNow } from '@/shared/model/time';

import type { UseCountdownRingInput } from './use-countdown-ring.types';

import { STROKE, TICK_MS, WARN_AT_SECONDS } from './use-countdown-ring.config';

export const useCountdownRing = ({ deadline, totalSeconds, size }: UseCountdownRingInput) => {
  const now = useNow(TICK_MS);

  const progress = useSharedValue(1);

  const left = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;

  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withTiming(clamp(left / totalSeconds, { max: 1 }), { duration: TICK_MS });
  }, [left, totalSeconds, progress]);

  const ring = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value)
  }));

  return {
    left,
    radius,
    circumference,
    strokeWidth: STROKE,
    isUrgent: left <= WARN_AT_SECONDS,
    ring
  };
};
