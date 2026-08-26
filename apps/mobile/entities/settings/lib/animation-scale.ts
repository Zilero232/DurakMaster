import type { AnimationSpeed } from '../model/settings-store';

const SCALE: Record<AnimationSpeed, number> = {
  calm: 1.6,
  normal: 1,
  instant: 0
};

export const animationScale = (speed: AnimationSpeed, isBatterySaver = false): number =>
  isBatterySaver ? Math.min(SCALE[speed], 0.5) : SCALE[speed];
