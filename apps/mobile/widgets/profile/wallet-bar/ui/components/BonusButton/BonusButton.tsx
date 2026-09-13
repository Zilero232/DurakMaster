import { LinearGradient } from 'expo-linear-gradient';
import { Gift, Timer } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { colors, gradientEnds, iconSize, surfaceGradient } from '@/ui-kit';

import type { BonusButtonProps } from './BonusButton.types';

import { styles } from './BonusButton.styles';

export const BonusButton = ({ isReady, countdown, onClaim }: BonusButtonProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityHint={t('profile.bonusHint')}
      accessibilityRole='button'
      accessibilityState={{ disabled: !isReady }}
      disabled={!isReady}
      style={({ pressed }) => [styles.root, !isReady && styles.waiting, pressed && styles.pressed]}
      onPress={onClaim}
    >
      {isReady && (
        <LinearGradient
          colors={surfaceGradient.success}
          end={gradientEnds.vertical.end}
          start={gradientEnds.vertical.start}
          style={styles.fill}
        />
      )}

      {isReady ? (
        <Gift color={colors.primaryForeground} size={iconSize.md} />
      ) : (
        <Timer color={colors.mutedForeground} size={iconSize.md} />
      )}

      <Text style={[styles.label, !isReady && styles.waitingLabel]}>
        {isReady ? t('profile.claimBonus') : t('profile.bonusIn', { time: countdown })}
      </Text>
    </Pressable>
  );
};
