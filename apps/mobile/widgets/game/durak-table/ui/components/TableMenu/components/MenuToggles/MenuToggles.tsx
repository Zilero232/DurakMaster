import { Vibrate, Volume2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useFeedbackToggles } from '../../../../../model';
import { MenuToggle } from '../MenuToggle';
import { styles } from './MenuToggles.styles';

export const MenuToggles = () => {
  const { t } = useTranslation();

  const { isSoundOn, isHapticsOn, toggleSound, toggleHaptics } = useFeedbackToggles();

  return (
    <View style={styles.root}>
      <MenuToggle
        icon={Volume2}
        label={t('settings.sound')}
        value={isSoundOn}
        onChange={toggleSound}
      />

      <MenuToggle
        icon={Vibrate}
        label={t('settings.haptics')}
        value={isHapticsOn}
        onChange={toggleHaptics}
      />
    </View>
  );
};
