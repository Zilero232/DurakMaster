import { Palette } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { CardThemeId } from '@/ui-kit';

import { useSettingsStore } from '@/entities/settings';
import { playSound } from '@/shared/lib/sound';
import { CARD_THEMES, useSetCardTheme } from '@/ui-kit';

import { SettingsSection } from '../SettingsSection';
import { ThemeOption } from '../ThemeOption';
import { styles } from './LookSettingsTab.styles';

export const LookSettingsTab = () => {
  const { t } = useTranslation();

  const cardTheme = useSettingsStore((store) => store.cardTheme);
  const setCardTheme = useSettingsStore((store) => store.setCardTheme);
  const applyCardTheme = useSetCardTheme();

  const handleSelectTheme = (id: CardThemeId) => {
    setCardTheme(id);
    applyCardTheme(id);
    playSound('deal');
  };

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
    </View>
  );
};
