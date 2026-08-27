import { useInterval } from '@siberiacancode/reactuse';
import { useState } from 'react';

export const useNow = (intervalMs: number): number => {
  const [now, setNow] = useState(() => Date.now());

  useInterval(() => {
    setNow(Date.now());
  }, intervalMs);

  return now;
};
