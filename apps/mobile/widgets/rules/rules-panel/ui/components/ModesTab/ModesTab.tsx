import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { RULE_MODES } from '../../RulesPanel.config';
import { ModeRow } from '../ModeRow';
import { styles } from './ModesTab.styles';

export const ModesTab = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Text style={styles.intro}>{t('rules.modesIntro')}</Text>

      {RULE_MODES.map((mode) => (
        <ModeRow key={mode.id} mode={mode} />
      ))}
    </View>
  );
};
