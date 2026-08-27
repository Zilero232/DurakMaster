import { getRankInfo } from '@durak-master/schemas';
import { ChevronRight, Flame, Percent, TrendingUp, Trophy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { colors, iconSize, LeagueBadge } from '@/ui-kit';

import type { ProfileSummaryProps } from './ProfileSummary.types';

import { SummaryTile } from './components';
import { styles } from './ProfileSummary.styles';

export const ProfileSummary = ({ profile, onOpenStats }: ProfileSummaryProps) => {
  const { t } = useTranslation();

  const rank = getRankInfo(profile.rating);

  const { gamesPlayed, gamesWon } = profile;
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <LeagueBadge league={rank.league.id} level={rank.level} size={48} />

        <View style={styles.league}>
          <Text style={[styles.leagueName, { color: rank.league.color }]}>
            {t(`profile.leagues.${rank.league.id}`)}
          </Text>

          <Text style={styles.leagueLevel}>{t('stats.level', { level: rank.level })}</Text>
        </View>

        <Pressable
          accessibilityRole='button'
          style={({ pressed }) => [styles.more, pressed && styles.morePressed]}
          onPress={onOpenStats}
        >
          <Text style={styles.moreLabel}>{t('stats.title')}</Text>

          <ChevronRight color={colors.onFeltMuted} size={iconSize.sm} />
        </Pressable>
      </View>

      <View style={styles.tiles}>
        <SummaryTile
          icon={TrendingUp}
          label={t('stats.rating')}
          tint={colors.info}
          value={String(profile.rating)}
        />

        <SummaryTile
          icon={Trophy}
          label={t('stats.wins')}
          tint={colors.gold}
          value={String(gamesWon)}
        />

        <SummaryTile
          icon={Percent}
          label={t('stats.winRate')}
          tint={colors.success}
          value={`${winRate}%`}
        />

        <SummaryTile
          icon={Flame}
          label={t('stats.loginStreak')}
          tint={colors.accent}
          value={String(profile.loginStreak)}
        />
      </View>
    </View>
  );
};
