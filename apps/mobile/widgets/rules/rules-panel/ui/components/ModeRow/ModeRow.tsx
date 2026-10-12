import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { colors, iconSize, Panel } from '@/ui-kit';

import type { ModeRowProps } from './ModeRow.types';

import { styles } from './ModeRow.styles';

export const ModeRow = ({ mode }: ModeRowProps) => {
  const { t } = useTranslation();

  const { id, icon: Icon } = mode;

  return (
    <Panel style={styles.root}>
      <View style={styles.icon}>
        <Icon color={colors.accent} size={iconSize.lg} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{t(`rules.modes.${id}.title`)}</Text>

        <Text style={styles.text}>{t(`rules.modes.${id}.text`)}</Text>
      </View>
    </Panel>
  );
};
