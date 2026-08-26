import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button, SegmentedControl, Sheet } from '@/ui-kit';

import type { RulesPanelProps } from './RulesPanel.types';

import { DOCUMENTED_GAMES, RULE_SECTIONS } from './RulesPanel.config';
import { styles } from './RulesPanel.styles';

export const RulesPanel = ({ isOpen, game = 'durak', onClose }: RulesPanelProps) => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState(game);

  const sections = RULE_SECTIONS[selected] ?? [];

  const gameOptions = DOCUMENTED_GAMES.map((id) => ({
    value: id,
    label: t(`games.${id}.name`)
  }));

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
      <View style={styles.root}>
        <SegmentedControl options={gameOptions} value={selected} onChange={setSelected} />

        <View style={styles.sections}>
          {sections.map((section) => (
            <View key={section} style={styles.section}>
              <Text style={styles.heading}>{t(`rules.${selected}.${section}.title`)}</Text>
              <Text style={styles.text}>{t(`rules.${selected}.${section}.text`)}</Text>
            </View>
          ))}
        </View>
      </View>
    </Sheet>
  );
};
