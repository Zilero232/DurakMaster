import { Easing, withTiming } from 'react-native-reanimated';

import { DEAL_FROM, DEAL_MS } from '../config';

export const dealFromTalon = () => {
  'worklet';

  const timing = { duration: DEAL_MS, easing: Easing.out(Easing.cubic) };

  return {
    initialValues: {
      opacity: 0,
      transform: [
        { translateX: DEAL_FROM.x },
        { translateY: DEAL_FROM.y },
        { rotate: `${DEAL_FROM.rotate}deg` }
      ]
    },
    animations: {
      opacity: withTiming(1, { duration: DEAL_MS }),
      transform: [
        { translateX: withTiming(0, timing) },
        { translateY: withTiming(0, timing) },
        { rotate: withTiming('0deg', timing) }
      ]
    }
  };
};
