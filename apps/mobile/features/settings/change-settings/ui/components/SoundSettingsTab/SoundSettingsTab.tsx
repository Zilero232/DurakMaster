import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useSettingsStore } from '@/entities/settings';
import { haptic } from '@/shared/lib/haptics';

import { SettingsSection } from '../SettingsSection';
import { SettingsToggle } from '../SettingsToggle';
import { VolumeSlider } from '../VolumeSlider';
import { styles } from './SoundSettingsTab.styles';

export const SoundSettingsTab = () => {
  const { t } = useTranslation();

  const volume = useSettingsStore((store) => store.volume);
  const setVolume = useSettingsStore((store) => store.setVolume);
  const isHapticsEnabled = useSettingsStore((store) => store.isHapticsEnabled);
  const setHapticsEnabled = useSettingsStore((store) => store.setHapticsEnabled);

  const handleToggleHaptics = (value: boolean) => {
    setHapticsEnabled(value);

    if (value) {
      haptic('tap');
    }
  };

  return (
    <View style={styles.root}>
      <SettingsSection title={t('settings.sound')}>
        <VolumeSlider label={t('settings.effects')} value={volume} onChange={setVolume} />
      </SettingsSection>

      <SettingsToggle
        description={t('settings.hapticsDescription')}
        title={t('settings.haptics')}
        value={isHapticsEnabled}
        onChange={handleToggleHaptics}
      />
    </View>
  );
};
