import { Coins } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { BoostButtonProps } from './BoostButton.types';

import { BOOST_HINTS, BOOST_ICONS, BOOST_LABELS } from '../../../config';
import { styles } from './BoostButton.styles';

export const BoostButton = ({ boost, price, isDimmed = false, onPress }: BoostButtonProps) => {
  const { t } = useTranslation();

  const Icon = BOOST_ICONS[boost];

  return (
    <Pressable
      accessibilityHint={t(BOOST_HINTS[boost])}
      accessibilityLabel={t(BOOST_LABELS[boost])}
      accessibilityRole='button'
      style={({ pressed }) => [styles.root, isDimmed && styles.dimmed, pressed && styles.pressed]}
      onPress={() => onPress(boost)}
    >
      <View style={styles.icon}>
        <Icon color={colors.onFelt} size={iconSize.md} />
      </View>

      <View style={styles.price}>
        <Coins color={colors.gold} size={iconSize.xs} />

        <Text style={styles.priceValue}>{price}</Text>
      </View>
    </Pressable>
  );
};
