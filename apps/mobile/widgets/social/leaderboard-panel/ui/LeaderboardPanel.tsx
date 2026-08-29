import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useLeaderboard } from '@/entities/social';
import { Avatar, Sheet } from '@/ui-kit';

import type { LeaderboardPanelProps } from './LeaderboardPanel.types';

import { styles } from './LeaderboardPanel.styles';

const PODIUM = 3;
const AVATAR_SIZE = 32;

export const LeaderboardPanel = ({ isOpen, onClose }: LeaderboardPanelProps) => {
  const { t } = useTranslation();

  const { leaderboard } = useLeaderboard();

  return (
    <Sheet isOpen={isOpen} title={t('leaderboard.title')} onClose={onClose}>
      <View style={styles.root}>
        {leaderboard.myRank !== null && (
          <View style={styles.myRank}>
            <Text style={styles.myRankValue}>#{leaderboard.myRank}</Text>
            <Text style={styles.myRankLabel}>{t('leaderboard.yourPlace')}</Text>
          </View>
        )}

        {leaderboard.entries.length === 0 ? (
          <Text style={styles.empty}>{t('leaderboard.empty')}</Text>
        ) : (
          leaderboard.entries.map((entry) => {
            const isPodium = entry.rank <= PODIUM;

            return (
              <View key={entry.profile.userId} style={[styles.row, isPodium && styles.podium]}>
                <Text style={[styles.rank, isPodium && styles.rankPodium]}>{entry.rank}</Text>

                <Avatar
                  name={entry.profile.name}
                  size={AVATAR_SIZE}
                  src={entry.profile.avatarUrl}
                />

                <Text numberOfLines={1} style={styles.name}>
                  {entry.profile.name}
                </Text>

                <Text style={styles.rating}>{entry.profile.rating}</Text>
              </View>
            );
          })
        )}
      </View>
    </Sheet>
  );
};
