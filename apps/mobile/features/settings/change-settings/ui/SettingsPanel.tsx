import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { CardThemeId } from '@/ui-kit';

import { useSettingsStore } from '@/entities/settings';
import { useLocale } from '@/shared/i18n';
import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';
import { CARD_THEMES, Sheet, useSetCardTheme } from '@/ui-kit';

import type { SettingsPanelProps } from './SettingsPanel.types';

import {
  LocaleOptions,
  SettingsSection,
  SettingsToggle,
  ThemeOption,
  VolumeSlider
} from './components';
import { styles } from './SettingsPanel.styles';

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { t } = useTranslation();

  const { locale, setLocale } = useLocale();

  const cardTheme = useSettingsStore((store) => store.cardTheme);
  const setCardTheme = useSettingsStore((store) => store.setCardTheme);
  const applyCardTheme = useSetCardTheme();
  const volume = useSettingsStore((store) => store.volume);
  const setVolume = useSettingsStore((store) => store.setVolume);
  const showHints = useSettingsStore((store) => store.showHints);
  const setShowHints = useSettingsStore((store) => store.setShowHints);
  const isHapticsEnabled = useSettingsStore((store) => store.isHapticsEnabled);
  const setHapticsEnabled = useSettingsStore((store) => store.setHapticsEnabled);

  const handleSelectTheme = (id: CardThemeId) => {
    setCardTheme(id);
    applyCardTheme(id);
    playSound('deal');
  };

  const handleToggleHaptics = (value: boolean) => {
    setHapticsEnabled(value);

    if (value) {
      haptic('tap');
    }
  };

  return (
    <Sheet isOpen={isOpen} title={t('settings.title')} onClose={onClose}>
      <View style={styles.sections}>
        <SettingsSection title={t('settings.language')}>
          <LocaleOptions value={locale} onChange={setLocale} />
        </SettingsSection>

        <SettingsSection title={t('settings.cardTheme')}>
          <View style={styles.themes}>
            {CARD_THEMES.map((theme) => (
              <ThemeOption
                key={theme.id}
                isActive={cardTheme === theme.id}
                label={t(`settings.themes.${theme.id}`)}
                theme={theme}
                onPress={() => handleSelectTheme(theme.id)}
              />
            ))}
          </View>
        </SettingsSection>

        <SettingsSection title={t('settings.sound')}>
          <VolumeSlider label={t('settings.volume')} value={volume} onChange={setVolume} />
        </SettingsSection>

        <SettingsToggle
          description={t('settings.hintsDescription')}
          title={t('settings.hints')}
          value={showHints}
          onChange={setShowHints}
        />

        <SettingsToggle
          description={t('settings.hapticsDescription')}
          title={t('settings.haptics')}
          value={isHapticsEnabled}
          onChange={handleToggleHaptics}
        />
      </View>
    </Sheet>
  );
};
