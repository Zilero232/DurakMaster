import { animationScale } from '../lib';
import { useSettingsStore } from './settings-store';

export const useAnimationSpeed = () => {
  const animationSpeed = useSettingsStore((store) => store.animationSpeed);
  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);

  const scale = animationScale(animationSpeed, isBatterySaver);

  return {
    scale,
    isInstant: scale === 0,

    duration: (base: number) => Math.max(0, Math.round(base * scale))
  };
};
