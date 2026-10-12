import { RefreshCw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors, duration, iconSize } from '@/ui-kit';

import type { TransferSlotProps } from './TransferSlot.types';

import { usePairMeasure } from '../../../../../model';
import { createTransferStyles } from './TransferSlot.styles';

export const TransferSlot = ({
  index,
  width,
  height,
  isHovered,
  onMeasure,
  onPress
}: TransferSlotProps) => {
  const { t } = useTranslation();

  const { viewRef, measure } = usePairMeasure({
    index,
    width,
    height,
    hasDefense: false,
    onMeasure
  });

  const styles = createTransferStyles(width, height);

  return (
    <Animated.View
      ref={viewRef}
      entering={FadeIn.duration(duration.fast)}
      exiting={FadeOut.duration(duration.fast)}
      onLayout={measure}
    >
      <Pressable
        accessibilityLabel={t('table.transfer')}
        accessibilityRole='button'
        style={({ pressed }) => [styles.root, (isHovered || pressed) && styles.hovered]}
        onPress={onPress}
      >
        <RefreshCw color={colors.info} size={iconSize.lg} />

        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.label}>
          {t('table.transfer')}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
