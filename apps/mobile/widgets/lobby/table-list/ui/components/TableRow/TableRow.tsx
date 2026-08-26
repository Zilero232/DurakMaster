import { ChevronRight, Crown, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';
import { Avatar, colors } from '@/ui-kit';

import type { TableRowProps } from './TableRow.types';

import { TableBadges } from '../TableBadges';
import { styles } from './TableRow.styles';

const VISIBLE_AVATARS = 4;

export const TableRow = ({ table, onJoin }: TableRowProps) => {
  const { t } = useTranslation();

  const { players, settings, hasPremiumPlayer } = table;
  const isPlaying = table.status === 'playing';
  const isBlocked = players.length >= settings.maxPlayers || isPlaying;

  const handlePress = () => {
    onJoin(table.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        hasPremiumPlayer && styles.premium,
        isBlocked && styles.blocked,
        pressed && styles.pressed
      ]}
      accessibilityRole='button'
      accessibilityState={{ disabled: isBlocked }}
      disabled={isBlocked}
      onPress={handlePress}
    >
      <View style={styles.betColumn}>
        <Text style={styles.bet}>{formatCredits(settings.bet)}</Text>

        <View style={styles.seats}>
          {Array.from({ length: settings.maxPlayers }, (_, seat) => (
            <View
              // biome-ignore lint/suspicious/noArrayIndexKey: место за столом определяется номером
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
              size={26}
              src={player.avatarUrl}
              style={styles.playerAvatar}
            />
          ))}

          <Text numberOfLines={1} style={styles.names}>
            {players.map((player) => player.name).join(', ') || t('lobby.emptySeats')}
          </Text>

          {hasPremiumPlayer && (
            <Crown accessibilityLabel={t('lobby.premiumPlayer')} color={colors.gold} size={15} />
          )}

          {settings.isPrivate && (
            <Lock
              accessibilityLabel={t('lobby.privateTable')}
              color={colors.subtleForeground}
              size={14}
            />
          )}
        </View>

        <TableBadges settings={settings} />
      </View>

      <View style={styles.action}>
        {isBlocked ? (
          <Text style={styles.blockedLabel}>
            {isPlaying ? t('lobby.inProgress') : t('lobby.full')}
          </Text>
        ) : (
          <ChevronRight color={colors.accent} size={22} />
        )}
      </View>
    </Pressable>
  );
};
