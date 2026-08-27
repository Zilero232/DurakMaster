import { Coins } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';

import { colors, iconSize } from '@/ui-kit';

import type { RewardBurstProps } from './RewardBurst.types';

import { useCountUp } from '../../../model';
import { styles } from './RewardBurst.styles';

export const RewardBurst = ({ creditsDelta, ratingDelta }: RewardBurstProps) => {
  const { t } = useTranslation();

  const credits = useCountUp(creditsDelta);

  if (creditsDelta === 0 && ratingDelta === 0) {
    return null;
  }

  const isLoss = creditsDelta < 0;

  return (
    <View style={styles.root}>
      <Animated.View
        entering={ZoomIn.duration(260)}
        exiting={FadeOut.duration(400)}
        style={styles.card}
      >
        <View style={styles.amount}>
          <Coins color={isLoss ? colors.danger : colors.gold} size={iconSize.xl} />

          <Text style={[styles.value, isLoss && styles.loss]}>
            {isLoss ? credits : `+${credits}`}
          </Text>
        </View>

        {ratingDelta > 0 && (
          <Text style={styles.rating}>{t('result.rating', { value: ratingDelta })}</Text>
        )}
      </Animated.View>
    </View>
  );
};
