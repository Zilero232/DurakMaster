import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useSocialStore } from '@/entities/social';
import { Sheet } from '@/ui-kit';

import type { AchievementsPanelProps } from './AchievementsPanel.types';

import { styles } from './AchievementsPanel.styles';
import { AchievementRow } from './components';

export const AchievementsPanel = ({ isOpen, onClose }: AchievementsPanelProps) => {
  const { t } = useTranslation();

  const achievements = useSocialStore((store) => store.achievements);
  const loadAchievements = useSocialStore((store) => store.loadAchievements);
  const claimAchievement = useSocialStore((store) => store.claimAchievement);

  useEffect(() => {
    if (isOpen) {
      loadAchievements();
    }
  }, [isOpen, loadAchievements]);

  const unlocked = achievements.filter((entry) => entry.unlockedAt !== null).length;

  const sorted = [...achievements].sort((a, b) => {
    const aClaimable = a.unlockedAt !== null && a.claimedAt === null ? 0 : 1;
    const bClaimable = b.unlockedAt !== null && b.claimedAt === null ? 0 : 1;

    return aClaimable - bClaimable;
  });

  return (
    <Sheet isOpen={isOpen} title={t('achievements.title')} onClose={onClose}>
      <View style={styles.root}>
        <View style={styles.summary}>
          <Text style={styles.summaryValue}>
            {unlocked} / {achievements.length}
          </Text>

          <Text style={styles.summaryLabel}>{t('achievements.unlocked')}</Text>
        </View>

        <View style={styles.list}>
          {sorted.map((achievement) => (
            <AchievementRow
              key={achievement.id}
              achievement={achievement}
              onClaim={claimAchievement}
            />
          ))}
        </View>
      </View>
    </Sheet>
  );
};
