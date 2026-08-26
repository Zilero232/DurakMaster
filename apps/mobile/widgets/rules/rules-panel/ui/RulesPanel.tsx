import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button, Sheet } from '@/ui-kit';

import type { RulesPanelProps } from './RulesPanel.types';

import { styles } from './RulesPanel.styles';

const SECTIONS = ['deal', 'firstMove', 'defend', 'throwIn', 'endBout', 'draw', 'end'] as const;

export const RulesPanel = ({ isOpen, onClose }: RulesPanelProps) => {
  const { t } = useTranslation();

  return (
    <Sheet
      footer={
        <Button isFullWidth variant='primary' onPress={onClose}>
          {t('rules.close')}
        </Button>
      }
      isOpen={isOpen}
      title={t('rules.title')}
      onClose={onClose}
    >
      <View style={styles.sections}>
        {SECTIONS.map((section) => (
          <View key={section} style={styles.section}>
            <Text style={styles.heading}>{t(`rules.${section}.title`)}</Text>
            <Text style={styles.text}>{t(`rules.${section}.text`)}</Text>
          </View>
        ))}
      </View>
    </Sheet>
  );
};
