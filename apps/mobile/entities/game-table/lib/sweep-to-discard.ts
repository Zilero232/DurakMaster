import { Easing, withTiming } from 'react-native-reanimated';

import { SWEEP_MS, SWEEP_TO } from '../config';

export const sweepToDiscard = () => {
  'worklet';

  const timing = { duration: SWEEP_MS, easing: Easing.in(Easing.cubic) };

  return {
    initialValues: {
      opacity: 1,
      transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: '0deg' }]
    },
    animations: {
      opacity: withTiming(0, { duration: SWEEP_MS }),
      transform: [
        { translateX: withTiming(SWEEP_TO.x, timing) },
        { translateY: withTiming(SWEEP_TO.y, timing) },
        { rotate: withTiming(`${SWEEP_TO.rotate}deg`, timing) }
      ]
    }
  };
};
