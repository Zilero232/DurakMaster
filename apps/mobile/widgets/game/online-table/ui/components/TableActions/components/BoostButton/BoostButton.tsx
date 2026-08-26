import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { BoostButtonProps } from './BoostButton.types';

import { BOOST_ICONS, BOOST_LABELS } from '../../TableActions.config';
import { styles } from './BoostButton.styles';

export const BoostButton = ({ boost, price, isDisabled = false, onPress }: BoostButtonProps) => {
  const { t } = useTranslation();

  const Icon = BOOST_ICONS[boost];

  return (
    <Pressable
      accessibilityLabel={t(BOOST_LABELS[boost])}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={[styles.root, isDisabled && styles.disabled]}
      onPress={() => onPress(boost)}
    >
      <Icon color={colors.onFelt} size={iconSize.md} />

      <Text style={styles.price}>{price}</Text>
    </Pressable>
  );
};
