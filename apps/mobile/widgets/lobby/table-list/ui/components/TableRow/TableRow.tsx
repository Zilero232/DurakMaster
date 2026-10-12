import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { formatCredits } from '@/shared/lib/format';
import { colors, gradientEnds, iconSize, Spinner, surfaceGradient } from '@/ui-kit';

import type { TableRowProps } from './TableRow.types';

import { formatSeatedNames } from '../../../lib';
import { TableRules } from '../TableRules';
import { BetColumn, SeatedPlayers } from './components';
import { styles } from './TableRow.styles';

export const TableRow = ({
  table,
  isPending = false,
  isDisabled = false,
  myUserId,
  onJoin
}: TableRowProps) => {
  const { t } = useTranslation();

  const { players, settings, hasPremiumPlayer } = table;

  const isPlaying = table.status === 'playing';
  const isBlocked = players.length >= settings.maxPlayers || isPlaying;
  const isInactive = isBlocked || isDisabled;

  const accessibilityLabel = [
    formatCredits(settings.bet),
    `${players.length}/${settings.maxPlayers}`,
    formatSeatedNames(players) ?? t('lobby.emptySeats')
  ].join(', ');

  const action = match({ isPending, isBlocked })
    .with({ isPending: true }, () => <Spinner size={iconSize.lg} />)
    .with({ isBlocked: true }, () => (
      <Text style={styles.blockedLabel}>{isPlaying ? t('lobby.inProgress') : t('lobby.full')}</Text>
    ))
    .otherwise(() => <ChevronRight color={colors.accent} size={iconSize.lg} />);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        hasPremiumPlayer && styles.premium,
        isInactive && styles.blocked,
        pressed && styles.pressed
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ busy: isPending, disabled: isInactive }}
      disabled={isInactive}
      onPress={() => onJoin(table.id)}
    >
      <LinearGradient
        colors={surfaceGradient.raised}
        end={gradientEnds.vertical.end}
        start={gradientEnds.vertical.start}
        style={styles.fill}
      />

      <BetColumn bet={settings.bet} seats={settings.maxPlayers} taken={players.length} />

      <View style={styles.main}>
        <SeatedPlayers hasPremiumPlayer={hasPremiumPlayer} players={players} />

        <TableRules settings={settings} />

        {table.ownerId === myUserId && <Text style={styles.ownBadge}>{t('lobby.ownTable')}</Text>}
      </View>

      <View style={styles.action}>{action}</View>
    </Pressable>
  );
};
