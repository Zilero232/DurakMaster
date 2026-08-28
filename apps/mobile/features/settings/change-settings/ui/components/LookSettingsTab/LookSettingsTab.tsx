import { Languages, Maximize2, Palette } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { CardScale } from '@/entities/settings';
import type { CardThemeId } from '@/ui-kit';

import { useSettingsStore } from '@/entities/settings';
import { useLocale } from '@/shared/i18n';
import { playSound } from '@/shared/lib/sound';
import { CARD_THEMES, SegmentedControl, useSetCardTheme } from '@/ui-kit';

import { LocaleOptions } from '../LocaleOptions';
import { SettingsSection } from '../SettingsSection';
import { ThemeOption } from '../ThemeOption';
import { styles } from './LookSettingsTab.styles';

export const LookSettingsTab = () => {
  const { t } = useTranslation();

  const { locale, setLocale } = useLocale();

  const cardTheme = useSettingsStore((store) => store.cardTheme);
  const setCardTheme = useSettingsStore((store) => store.setCardTheme);
  const applyCardTheme = useSetCardTheme();
  const cardScale = useSettingsStore((store) => store.cardScale);
  const setCardScale = useSettingsStore((store) => store.setCardScale);

  const handleSelectTheme = (id: CardThemeId) => {
    setCardTheme(id);
    applyCardTheme(id);
    playSound('deal');
  };

  const scaleOptions: { value: CardScale; label: string }[] = [
    { value: 'small', label: t('settings.scale.small') },
    { value: 'normal', label: t('settings.scale.normal') },
    { value: 'large', label: t('settings.scale.large') }
  ];

  return (
    <View style={styles.root}>
      <SettingsSection icon={Palette} title={t('settings.cardTheme')}>
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

      <SettingsSection icon={Maximize2} title={t('settings.cardScale')}>
        <SegmentedControl options={scaleOptions} value={cardScale} onChange={setCardScale} />
      </SettingsSection>

      <SettingsSection icon={Languages} title={t('settings.language')}>
        <LocaleOptions value={locale} onChange={setLocale} />
      </SettingsSection>
    </View>
  );
};
