import type { AnimationSpeed } from '../model/store';

const BATTERY_SAVER_MAX = 0.5;

const SCALE: Record<AnimationSpeed, number> = {
  calm: 1.6,
  normal: 1,
  instant: 0
};

export type AnimationScaleInput = {
  speed: AnimationSpeed;
  isBatterySaver?: boolean;
};

export const animationScale = ({ speed, isBatterySaver = false }: AnimationScaleInput): number =>
  isBatterySaver ? Math.min(SCALE[speed], BATTERY_SAVER_MAX) : SCALE[speed];
