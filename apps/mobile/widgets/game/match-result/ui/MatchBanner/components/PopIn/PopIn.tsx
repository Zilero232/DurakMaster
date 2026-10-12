import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring
} from 'react-native-reanimated';

import type { PopInProps } from './PopIn.types';

import { DROP_FROM, POP_SPRING, RISE_FROM, ZOOM_FROM } from './PopIn.config';

export const PopIn = ({ children, motion, delayMs, style }: PopInProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delayMs, withSpring(1, POP_SPRING));
  }, [delayMs, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const rest = 1 - progress.value;

    return {
      opacity: Math.min(1, progress.value * 2),
      transform: [
        {
          translateY:
            motion === 'drop' ? DROP_FROM * rest : motion === 'rise' ? RISE_FROM * rest : 0
        },
        { scale: motion === 'zoom' ? ZOOM_FROM + (1 - ZOOM_FROM) * progress.value : 1 }
      ]
    };
  });

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};
