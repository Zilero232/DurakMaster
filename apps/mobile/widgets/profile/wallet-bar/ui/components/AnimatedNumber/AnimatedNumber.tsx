import { useInterval } from '@siberiacancode/reactuse';
import { useEffect, useRef, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useAnimationSpeed } from '@/entities/settings';
import { duration } from '@/ui-kit';

import type { AnimatedNumberProps } from './AnimatedNumber.types';

import { MIN_TICK_MS, STEPS } from './AnimatedNumber.config';
import { styles } from './AnimatedNumber.styles';

export const AnimatedNumber = ({ value, suffix = '', style }: AnimatedNumberProps) => {
  const { duration: scaled, isInstant } = useAnimationSpeed();

  const [counted, setCounted] = useState(value);

  const countedRef = useRef(value);
  const fromRef = useRef(value);
  const stepRef = useRef(0);

  const { pause, resume } = useInterval(
    () => {
      stepRef.current += 1;

      const isLast = stepRef.current >= STEPS;
      const next = isLast
        ? value
        : Math.round(fromRef.current + ((value - fromRef.current) / STEPS) * stepRef.current);

      countedRef.current = next;
      setCounted(next);

      if (isLast) {
        pause();
      }
    },
    Math.max(MIN_TICK_MS, scaled(duration.panel) / STEPS),
    { immediately: false }
  );

  useEffect(() => {
    if (countedRef.current === value || isInstant) {
      return;
    }

    fromRef.current = countedRef.current;
    stepRef.current = 0;
    resume();
  }, [value, isInstant, resume]);

  const shown = isInstant ? value : counted;

  return (
    <Animated.Text entering={FadeIn} numberOfLines={1} style={[styles.root, style]}>
      {shown}
      {suffix}
    </Animated.Text>
  );
};
