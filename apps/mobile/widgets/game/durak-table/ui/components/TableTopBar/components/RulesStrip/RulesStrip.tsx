import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { RULE_ICONS } from '@/entities/game-table';
import { colors, iconSize } from '@/ui-kit';

import type { RulesStripProps } from './RulesStrip.types';

import { styles } from './RulesStrip.styles';

export const RulesStrip = ({ rules, onPress }: RulesStripProps) => {
  const { t } = useTranslation();

  const shown = rules.filter((rule) => rule.isInStrip);

  return (
    <Pressable
      accessibilityHint={shown.map((rule) => `${rule.label}: ${rule.value}`).join(', ')}
      accessibilityLabel={t('table.menuRules')}
      accessibilityRole='button'
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
      onPress={onPress}
    >
      {shown.map((rule) => {
        const Icon = RULE_ICONS[rule.icon];

        return (
          <View key={rule.icon} style={styles.item}>
            <Icon
              color={rule.icon === 'bet' ? colors.success : colors.onFeltMuted}
              size={iconSize.sm}
            />

            {rule.stripText !== null && <Text style={styles.text}>{rule.stripText}</Text>}
          </View>
        );
      })}
    </Pressable>
  );
};
