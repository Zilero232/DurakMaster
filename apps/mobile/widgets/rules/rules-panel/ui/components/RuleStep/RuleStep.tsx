import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { cardKey } from '@/shared/lib/cards';
import { colors, iconSize, Panel, PlayingCard } from '@/ui-kit';

import type { RuleStepProps } from './RuleStep.types';

import { EXAMPLE_ANSWER_ROTATION, EXAMPLE_CARD_WIDTH } from '../../RulesPanel.config';
import { styles } from './RuleStep.styles';

export const RuleStep = ({ step, number }: RuleStepProps) => {
  const { t } = useTranslation();

  const { id, icon: Icon, examples = [] } = step;

  return (
    <Panel style={styles.root}>
      <View style={styles.header}>
        <View style={styles.number}>
          <Text style={styles.numberText}>{number}</Text>
        </View>

        <Text style={styles.title}>{t(`rules.durak.${id}.title`)}</Text>

        <Icon color={colors.subtleForeground} size={iconSize.md} />
      </View>

      <Text style={styles.text}>{t(`rules.durak.${id}.text`)}</Text>

      {examples.map((example) => (
        <View key={example.captionKey} style={styles.example}>
          <View style={styles.cards}>
            {example.cards.map((card, index) => (
              <PlayingCard
                key={cardKey(card)}
                card={card}
                rotation={index === 0 ? 0 : EXAMPLE_ANSWER_ROTATION}
                style={index > 0 && styles.overlap}
                width={EXAMPLE_CARD_WIDTH}
              />
            ))}
          </View>

          <Text style={styles.caption}>{t(example.captionKey)}</Text>
        </View>
      ))}
    </Panel>
  );
};
