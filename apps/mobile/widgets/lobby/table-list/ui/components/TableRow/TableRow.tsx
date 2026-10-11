import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Crown, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { formatCredits } from '@/shared/lib/format';
import { Avatar, colors, gradientEnds, iconSize, Spinner, surfaceGradient } from '@/ui-kit';

import type { TableRowProps } from './TableRow.types';

import { TableBadges } from '../TableBadges';
import { VISIBLE_AVATARS } from './TableRow.config';
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

      <View style={styles.betColumn}>
        <Text style={styles.bet}>{formatCredits(settings.bet)}</Text>

        {table.ownerId === myUserId && <Text style={styles.ownBadge}>{t('lobby.ownTable')}</Text>}

        <View style={styles.seats}>
          {Array.from({ length: settings.maxPlayers }, (_, seat) => (
            <View
              key={`${table.id}-seat-${seat}`}
              style={[styles.seat, seat < players.length && styles.seatTaken]}
            />
          ))}
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.players}>
          {players.slice(0, VISIBLE_AVATARS).map((player) => (
            <Avatar
              key={player.userId}
              name={player.name}
              size={iconSize.lg}
              src={player.avatarUrl}
              style={styles.playerAvatar}
            />
          ))}

          <Text numberOfLines={1} style={styles.names}>
            {players.map((player) => player.name).join(', ') || t('lobby.emptySeats')}
          </Text>

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
              size={iconSize.xs}
            />
          )}
        </View>

        <TableBadges settings={settings} />
      </View>

      <View style={styles.action}>{action}</View>
    </Pressable>
  );
};
