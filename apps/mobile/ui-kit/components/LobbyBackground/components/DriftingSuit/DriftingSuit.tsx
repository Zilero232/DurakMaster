import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import type { DriftingSuitProps } from './DriftingSuit.types';

import { SuitIcon } from '../../../../icons';
import { colors } from '../../../../theme';
import { DRIFT_DISTANCE, DRIFT_MS, TILT_DEGREES } from './DriftingSuit.config';
import { styles } from './DriftingSuit.styles';

const AnimatedSuit = Animated.createAnimatedComponent(SuitIcon);

export const DriftingSuit = ({ mark, top, left, isStatic }: DriftingSuitProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isStatic) {
      return;
    }

    const duration = DRIFT_MS * mark.speed;

    progress.value = withDelay(
      mark.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [isStatic, mark.delay, mark.speed, progress]);

  const drift = useAnimatedStyle(() => {
    const shift = progress.value * DRIFT_DISTANCE * mark.direction;

    return {
      transform: [
        { translateY: shift },
        { rotate: `${mark.rotate + progress.value * TILT_DEGREES * mark.direction}deg` }
      ]
    };
  });

  return (
    <AnimatedSuit
      color={colors.foreground}
      size={mark.size}
      style={[styles.mark, { top, left, opacity: mark.opacity }, drift]}
      suit={mark.suit}
    />
  );
};
