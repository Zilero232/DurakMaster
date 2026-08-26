import { useEffect, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import { duration } from '@/ui-kit';

import type { AnimatedNumberProps } from './AnimatedNumber.types';

import { styles } from './AnimatedNumber.styles';

const STEPS = 12;

export const AnimatedNumber = ({ value, suffix = '', style }: AnimatedNumberProps) => {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (shown === value) {
      return;
    }

    const from = shown;
    const step = (value - from) / STEPS;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;

      setShown(current >= STEPS ? value : Math.round(from + step * current));

      if (current >= STEPS) {
        clearInterval(timer);
      }
    }, duration.panel / STEPS);

    return () => {
      clearInterval(timer);
    };
  }, [value, shown]);

  return (
    <Animated.Text entering={FadeIn} numberOfLines={1} style={[styles.root, style]}>
      {shown}
      {suffix}
    </Animated.Text>
  );
};
