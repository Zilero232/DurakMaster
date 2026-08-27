import { ChevronRight, Crown, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';
import { Avatar, colors, iconSize } from '@/ui-kit';

import type { TableViewProps } from '../view.types';

import { TableBadges } from '../../../TableBadges';
import { styles } from '../../TableRow.styles';

const VISIBLE_AVATARS = 4;

export const TableTile = ({ table, isBlocked, isPlaying }: TableViewProps) => {
  const { t } = useTranslation();

  const { players, settings, hasPremiumPlayer } = table;

  return (
    <>
      <View style={styles.tileHeader}>
        <Text style={styles.tileBet}>{formatCredits(settings.bet)}</Text>

        <View style={styles.seats}>
          {Array.from({ length: settings.maxPlayers }, (_, seat) => (
            <View
              key={`${table.id}-seat-${seat}`}
              style={[styles.seat, seat < players.length && styles.seatTaken]}
            />
          ))}
        </View>
      </View>

      <View style={styles.players}>
        {players.slice(0, VISIBLE_AVATARS).map((player) => (
          <Avatar
            key={player.userId}
            name={player.name}
            size={iconSize.xl}
            src={player.avatarUrl}
            style={styles.playerAvatar}
          />
        ))}

        <Text numberOfLines={1} style={styles.tileNames}>
          {players.map((player) => player.name).join(', ') || t('lobby.emptySeats')}
        </Text>
      </View>

      <TableBadges settings={settings} />

      <View style={styles.tileFooter}>
        <View style={styles.players}>
          {hasPremiumPlayer && (
            <Crown
              accessibilityLabel={t('lobby.premiumPlayer')}
              color={colors.gold}
              size={iconSize.sm}
            />
          )}

          {settings.isPrivate && (
            <Lock
              accessibilityLabel={t('lobby.privateTable')}
              color={colors.subtleForeground}
              size={iconSize.sm}
            />
          )}
        </View>

        {isBlocked ? (
          <Text style={styles.blockedLabel}>
            {isPlaying ? t('lobby.inProgress') : t('lobby.full')}
          </Text>
        ) : (
          <View style={styles.tileJoin}>
            <Text style={styles.tileJoinLabel}>{t('lobby.join')}</Text>

            <ChevronRight color={colors.primaryForeground} size={iconSize.sm} />
          </View>
        )}
      </View>
    </>
  );
};
