import { Coins } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors, iconSize } from '@/ui-kit';

import type { BoostButtonProps } from './BoostButton.types';

import { useBoostHint } from '../../../../../model';
import { BOOST_HINTS, BOOST_ICONS, BOOST_LABELS } from '../../TableActions.config';
import { styles } from './BoostButton.styles';

export const BoostButton = ({ boost, price, isDisabled = false, onPress }: BoostButtonProps) => {
  const { t } = useTranslation();

  const { isHintVisible, showHint } = useBoostHint();

  const Icon = BOOST_ICONS[boost];

  return (
    <View style={styles.root}>
      {isHintVisible && (
        <Animated.View
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(160)}
          style={styles.hint}
        >
          <Text style={styles.hintTitle}>{t(BOOST_LABELS[boost])}</Text>

          <Text style={styles.hintText}>{t(BOOST_HINTS[boost])}</Text>
        </Animated.View>
      )}

      <Pressable
        accessibilityHint={t(BOOST_HINTS[boost])}
        accessibilityLabel={t(BOOST_LABELS[boost])}
        accessibilityRole='button'
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        style={[styles.button, isDisabled && styles.disabled]}
        onLongPress={showHint}
        onPress={() => onPress(boost)}
      >
        <View style={styles.icon}>
          <Icon color={colors.onFelt} size={iconSize.sm} />
        </View>

        <View style={styles.price}>
          <Coins color={colors.gold} size={10} />

          <Text style={styles.priceValue}>{price}</Text>
        </View>
      </Pressable>
    </View>
  );
};
