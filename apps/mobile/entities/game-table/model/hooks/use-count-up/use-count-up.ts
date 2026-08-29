import { useEffect, useState } from 'react';

import { COUNT_UP_MS, COUNT_UP_STEPS } from '../../../config';

export const useCountUp = (target: number): number => {
  const [value, setValue] = useState(0);
  const [source, setSource] = useState(target);

  if (source !== target) {
    setSource(target);
    setValue(0);
  }

  useEffect(() => {
    if (target === 0) {
      return;
    }

    let step = 0;

    const timer = setInterval(() => {
      step += 1;

      setValue(step >= COUNT_UP_STEPS ? target : Math.round((target * step) / COUNT_UP_STEPS));

      if (step >= COUNT_UP_STEPS) {
        clearInterval(timer);
      }
    }, COUNT_UP_MS / COUNT_UP_STEPS);

    return () => clearInterval(timer);
  }, [target]);

  return value;
};
