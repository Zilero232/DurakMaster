import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { RULE_ICONS } from '@/entities/game-table';
import { colors, iconSize } from '@/ui-kit';

import type { MenuRulesProps } from './MenuRules.types';

import { styles } from './MenuRules.styles';

export const MenuRules = ({ rules }: MenuRulesProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{t('table.menuRules')}</Text>

      {rules.map((rule) => {
        const Icon = RULE_ICONS[rule.icon];

        return (
          <View key={rule.icon} style={styles.row}>
            <Icon color={colors.mutedForeground} size={iconSize.md} />

            <Text style={styles.label}>{rule.label}</Text>

            <Text style={styles.value}>{rule.value}</Text>
          </View>
        );
      })}
    </View>
  );
};
