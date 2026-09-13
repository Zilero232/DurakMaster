import { useInterval } from '@siberiacancode/reactuse';
import { useEffect, useRef, useState } from 'react';

import type { CountRun, UseCountToInput } from './use-count-to.types';

import { MIN_TICK_MS, STEPS } from './use-count-to.config';

const stepValue = (run: CountRun, to: number): number =>
  Math.round(run.from + ((to - run.from) / STEPS) * run.step);

export const useCountTo = ({ value, durationMs, isFromZero = false }: UseCountToInput): number => {
  const [shown, setShown] = useState(isFromZero ? 0 : value);

  const runRef = useRef<CountRun>({ from: shown, step: 0 });

  const shownRef = useRef(shown);

  const { pause, resume } = useInterval(
    () => {
      runRef.current.step += 1;

      const isLast = runRef.current.step >= STEPS;

      shownRef.current = isLast ? value : stepValue(runRef.current, value);

      setShown(shownRef.current);

      if (isLast) {
        pause();
      }
    },
    Math.max(MIN_TICK_MS, durationMs / STEPS),
    { immediately: false }
  );

  useEffect(() => {
    if (durationMs === 0) {
      shownRef.current = value;
      runRef.current = { from: value, step: STEPS };

      return;
    }

    runRef.current = { from: isFromZero ? 0 : shownRef.current, step: 0 };

    resume();
  }, [value, durationMs, isFromZero, resume]);

  return durationMs === 0 ? value : shown;
};
