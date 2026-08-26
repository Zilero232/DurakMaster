import { Coins, Trophy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button, colors, iconSize } from '@/ui-kit';

import type { AchievementRowProps } from './AchievementRow.types';

import { styles } from './AchievementRow.styles';

export const AchievementRow = ({ achievement, onClaim }: AchievementRowProps) => {
  const { t } = useTranslation();

  const { id, progress, target, reward, unlockedAt, claimedAt } = achievement;

  const isUnlocked = unlockedAt !== null;
  const isClaimable = isUnlocked && claimedAt === null;

  return (
    <View style={[styles.root, !isUnlocked && styles.locked]}>
      <View style={styles.head}>
        <Trophy color={isUnlocked ? colors.gold : colors.subtleForeground} size={iconSize.lg} />

        <View style={styles.info}>
          <Text style={styles.title}>{t(`achievements.${id}.title`)}</Text>
          <Text style={styles.description}>{t(`achievements.${id}.description`)}</Text>
        </View>

        {isClaimable ? (
          <Button size='sm' variant='primary' onPress={() => onClaim(id)}>
            {t('achievements.claim')}
          </Button>
        ) : (
          <View style={styles.reward}>
            <Coins color={colors.gold} size={iconSize.xs} />
            <Text style={styles.rewardValue}>{reward}</Text>
          </View>
        )}
      </View>

      {!isUnlocked && (
        <>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(progress / target) * 100}%` }]} />
          </View>

          <Text style={styles.progress}>
            {progress} / {target}
          </Text>
        </>
      )}
    </View>
  );
};
