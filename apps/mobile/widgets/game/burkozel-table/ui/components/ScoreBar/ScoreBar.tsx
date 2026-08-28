import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { ScoreBarProps } from './ScoreBar.types';

import { styles } from '../../BurkozelTable.styles';

export const ScoreBar = ({ points, talonCount }: ScoreBarProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.score}>
      <View>
        <Text style={styles.label}>{t('games.burkozel.yourPoints')}</Text>
        <Text style={styles.value}>{points}</Text>
      </View>

      <View>
        <Text style={styles.label}>{t('table.deckLeft')}</Text>
        <Text style={styles.value}>{talonCount}</Text>
      </View>
    </View>
  );
};
