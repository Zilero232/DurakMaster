import { DEFAULT_VOLUME, useSettingsStore } from '@/entities/settings';
import { haptic } from '@/shared/lib/haptics';

export const useFeedbackToggles = () => {
  const volume = useSettingsStore((store) => store.volume);
  const setVolume = useSettingsStore((store) => store.setVolume);
  const isHapticsOn = useSettingsStore((store) => store.isHapticsEnabled);
  const setHapticsEnabled = useSettingsStore((store) => store.setHapticsEnabled);

  const toggleSound = (isOn: boolean) => setVolume(isOn ? DEFAULT_VOLUME : 0);

  const toggleHaptics = (isOn: boolean) => {
    setHapticsEnabled(isOn);

    if (isOn) {
      haptic('tap');
    }
  };

  return { isSoundOn: volume > 0, isHapticsOn, toggleSound, toggleHaptics };
};
