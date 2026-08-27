import { getRankInfo } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Avatar, Sheet, StatRow } from '@/ui-kit';

import type { PlayerCardProps } from './PlayerCard.types';

import { AVATAR_SIZE, styles } from './PlayerCard.styles';

export const PlayerCard = ({ profile, isOpen, onClose }: PlayerCardProps) => {
  const { t } = useTranslation();

  if (!profile) {
    return null;
  }

  const rank = getRankInfo(profile.rating);
  const decided = profile.gamesWon + profile.gamesLost;
  const winRate = decided === 0 ? 0 : profile.gamesWon / decided;

  return (
    <Sheet isOpen={isOpen} title={t('stats.title')} onClose={onClose}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={[styles.ring, { borderColor: rank.league.color }]}>
            <Avatar name={profile.name} size={AVATAR_SIZE} src={profile.avatarUrl} />
          </View>

          <Text numberOfLines={1} style={styles.name}>
            {profile.name}
          </Text>

          <Text style={[styles.league, { color: rank.league.color }]}>
            {t(`profile.leagues.${rank.league.id}`)} · {rank.level}
          </Text>

          <View style={styles.presence}>
            <View style={[styles.dot, profile.isOnline ? styles.online : styles.offline]} />

            <Text style={styles.presenceLabel}>
              {t(profile.isOnline ? 'friends.online' : 'friends.offline')}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <StatRow label={t('stats.rating')} value={String(profile.rating)} />
          <StatRow label={t('stats.gamesPlayed')} value={String(profile.gamesPlayed)} />
          <StatRow label={t('stats.wins')} value={String(profile.gamesWon)} />
          <StatRow label={t('stats.losses')} value={String(profile.gamesLost)} />
          <StatRow
            label={t('stats.winRate')}
            progress={winRate}
            value={`${Math.round(winRate * 100)}%`}
          />
        </View>
      </View>
    </Sheet>
  );
};
