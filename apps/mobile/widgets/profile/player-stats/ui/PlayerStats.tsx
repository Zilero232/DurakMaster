import { getRankInfo } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Sheet, StatRow } from '@/ui-kit';

import type { PlayerStatsProps } from './PlayerStats.types';

import { styles } from './PlayerStats.styles';

export const PlayerStats = ({ profile, isOpen, onClose }: PlayerStatsProps) => {
  const { t } = useTranslation();

  const rank = getRankInfo(profile.rating);

  const { gamesPlayed, gamesWon, gamesLost } = profile;
  const winRate = gamesPlayed > 0 ? gamesWon / gamesPlayed : 0;

  return (
    <Sheet isOpen={isOpen} title={t('stats.title')} onClose={onClose}>
      <View style={styles.root}>
        <View style={styles.league}>
          <Text style={[styles.leagueName, { color: rank.league.color }]}>
            {t(`profile.leagues.${rank.league.id}`)}
          </Text>

          <Text style={styles.leagueLevel}>{t('stats.level', { level: rank.level })}</Text>
        </View>

        <View style={styles.rows}>
          <StatRow
            label={t('stats.nextLevel')}
            progress={rank.progress}
            value={`${Math.round(rank.progress * 100)}%`}
          />

          <StatRow label={t('stats.rating')} value={String(profile.rating)} />

          <StatRow label={t('stats.gamesPlayed')} value={String(gamesPlayed)} />

          <StatRow
            label={t('stats.winRate')}
            progress={winRate}
            value={`${Math.round(winRate * 100)}%`}
          />

          <StatRow label={t('stats.wins')} value={String(gamesWon)} />

          <StatRow label={t('stats.losses')} value={String(gamesLost)} />

          <StatRow label={t('stats.loginStreak')} value={String(profile.loginStreak)} />
        </View>
      </View>
    </Sheet>
  );
};
