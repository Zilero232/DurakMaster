import { clamp } from 'remeda';

import type { FanOverlapInput } from './fan-overlap.types';

const MAX_OVERLAP_RATIO = 0.82;

export const fanOverlap = ({ count, width, available, looseRatio }: FanOverlapInput): number => {
  if (count < 2) {
    return 0;
  }

  const loose = width * looseRatio;
  const needed = width + (count - 1) * (width + loose);

  if (needed <= available) {
    return loose;
  }

  const tight = (available - width) / (count - 1) - width;

  return clamp(tight, { min: -width * MAX_OVERLAP_RATIO, max: loose });
};
