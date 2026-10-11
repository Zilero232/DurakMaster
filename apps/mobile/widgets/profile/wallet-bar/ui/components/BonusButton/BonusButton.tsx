import { LinearGradient } from 'expo-linear-gradient';
import { Clapperboard, Gift, Timer } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { useWatchAd } from '@/features/profile/watch-ad';
import { colors, gradientEnds, iconSize, surfaceGradient } from '@/ui-kit';

import type { BonusButtonProps } from './BonusButton.types';

import { styles } from './BonusButton.styles';

export const BonusButton = ({ isReady, countdown, onClaim }: BonusButtonProps) => {
  const { t } = useTranslation();

  const { isAvailable, isBusy, isConfirming, watch } = useWatchAd();

  const canSkipWait = !isReady && isAvailable;

  const isActionable = isReady || canSkipWait;

  const Icon = isReady ? Gift : canSkipWait ? Clapperboard : Timer;

  const waitingLabel = canSkipWait
    ? t('profile.bonusSkipWithAd')
    : t('profile.bonusIn', { time: countdown });

  const skippingLabel = isConfirming ? t('profile.adConfirming') : waitingLabel;

  const label = isReady ? t('profile.claimBonus') : skippingLabel;

  return (
    <Pressable
      accessibilityHint={t('profile.bonusHint')}
      accessibilityRole='button'
      accessibilityState={{ busy: isBusy, disabled: !isActionable }}
      disabled={!isActionable || isBusy}
      style={({ pressed }) => [styles.root, !isReady && styles.waiting, pressed && styles.pressed]}
      onPress={isReady ? onClaim : watch}
    >
      {isReady && (
        <LinearGradient
          colors={surfaceGradient.success}
          end={gradientEnds.vertical.end}
          start={gradientEnds.vertical.start}
          style={styles.fill}
        />
      )}

      <Icon
        color={isReady ? colors.primaryForeground : colors.mutedForeground}
        size={iconSize.md}
      />

      <Text style={[styles.label, !isReady && styles.waitingLabel]}>{label}</Text>
    </Pressable>
  );
};
