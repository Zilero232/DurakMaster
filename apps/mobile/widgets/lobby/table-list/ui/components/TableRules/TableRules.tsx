import { Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { RULE_ICONS } from '@/entities/game-table';
import { colors } from '@/ui-kit';

import type { TableRulesProps } from './TableRules.types';

import { RULE_ICON_SIZE, styles } from './TableRules.styles';

export const TableRules = ({ settings }: TableRulesProps) => {
  const { t } = useTranslation();

  const { rules, speed, isPrivate } = settings;

  const DeckIcon = RULE_ICONS.deck;
  const ModeIcon = RULE_ICONS[rules.mode];
  const ScopeIcon = RULE_ICONS[`${rules.throwInScope}Scope`];
  const CheatersIcon = RULE_ICONS.cheaters;
  const JokersIcon = RULE_ICONS.jokers;
  const FastIcon = RULE_ICONS.fastSpeed;

  return (
    <View style={styles.root}>
      <View accessibilityLabel={t('games.durak.deck')} style={styles.deck}>
        <DeckIcon color={colors.mutedForeground} size={RULE_ICON_SIZE} />

        <Text style={styles.deckSize}>{rules.deckSize}</Text>
      </View>

      <ModeIcon
        accessibilityLabel={t(`games.durak.mode.${rules.mode}`)}
        color={colors.mutedForeground}
        size={RULE_ICON_SIZE}
      />

      <ScopeIcon
        accessibilityLabel={t(`games.durak.throwInScope.${rules.throwInScope}`)}
        color={colors.mutedForeground}
        size={RULE_ICON_SIZE}
      />

      {rules.fairness === 'cheaters' && (
        <CheatersIcon
          accessibilityLabel={t('games.durak.fairness.cheaters')}
          color={colors.accent}
          size={RULE_ICON_SIZE}
        />
      )}

      {rules.withJokers && (
        <JokersIcon
          accessibilityLabel={t('games.durak.withJokers')}
          color={colors.accent}
          size={RULE_ICON_SIZE}
        />
      )}

      {speed === 'fast' && (
        <FastIcon
          accessibilityLabel={t('create.speedFast')}
          color={colors.accent}
          size={RULE_ICON_SIZE}
        />
      )}

      {isPrivate && (
        <Lock
          accessibilityLabel={t('lobby.privateTable')}
          color={colors.subtleForeground}
          size={RULE_ICON_SIZE}
        />
      )}
    </View>
  );
};
