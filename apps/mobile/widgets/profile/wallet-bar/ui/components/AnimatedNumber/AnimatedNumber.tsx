import Animated, { FadeIn } from 'react-native-reanimated';

import { useAnimationSpeed } from '@/entities/settings';
import { useCountTo } from '@/shared/model/time';
import { duration } from '@/ui-kit';

import type { AnimatedNumberProps } from './AnimatedNumber.types';

import { styles } from './AnimatedNumber.styles';

export const AnimatedNumber = ({ value, suffix = '', style }: AnimatedNumberProps) => {
  const { duration: scaled } = useAnimationSpeed();

  const counted = useCountTo({ value, durationMs: scaled(duration.panel) });

  return (
    <Animated.Text entering={FadeIn} numberOfLines={1} style={[styles.root, style]}>
      {counted}
      {suffix}
    </Animated.Text>
  );
};
