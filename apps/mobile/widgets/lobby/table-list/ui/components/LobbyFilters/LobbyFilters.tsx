import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import type { LobbyFiltersProps } from './LobbyFilters.types';

import { GAME_ICONS } from '../TableBadges/TableBadges.config';
import { FilterChip } from './components';
import { BET_OPTIONS, GAME_OPTIONS } from './LobbyFilters.config';
import { styles } from './LobbyFilters.styles';

export const LobbyFilters = ({
  game,
  bet,
  hideFull,
  count,
  onChangeGame,
  onChangeBet,
  onToggleHideFull
}: LobbyFiltersProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.chips}
        showsHorizontalScrollIndicator={false}
      >
        {GAME_OPTIONS.map((option) => (
          <FilterChip
            key={option}
            icon={option === 'all' ? undefined : GAME_ICONS[option]}
            isActive={option === game}
            label={option === 'all' ? t('lobby.allGames') : t(`games.${option}.name`)}
            onPress={() => onChangeGame(option)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        contentContainerStyle={styles.chips}
        showsHorizontalScrollIndicator={false}
      >
        {BET_OPTIONS.map((option) => (
          <FilterChip
            key={option}
            isActive={option === bet}
            label={t(`lobby.bets.${option}`)}
            onPress={() => onChangeBet(option)}
          />
        ))}
      </ScrollView>

      <View style={styles.row}>
        <FilterChip
          accessibilityRole='checkbox'
          icon={hideFull ? Check : undefined}
          isActive={hideFull}
          label={t('lobby.onlyJoinable')}
          onPress={onToggleHideFull}
        />

        <Text style={styles.count}>{t('lobby.tableCount', { count })}</Text>
      </View>
    </View>
  );
};
