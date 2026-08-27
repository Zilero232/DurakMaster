import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { GamePickerProps } from './GamePicker.types';

import { GAME_ITEMS } from './GamePicker.config';
import { styles } from './GamePicker.styles';

export const GamePicker = ({ value, onChange }: GamePickerProps) => {
  const { t } = useTranslation();

  return (
    <View accessibilityRole='radiogroup' style={styles.root}>
      {GAME_ITEMS.map(({ id, icon: Icon }) => {
        const isActive = id === value;

        return (
          <Pressable
            key={id}
            style={({ pressed }) => [
              styles.card,
              isActive && styles.active,
              pressed && styles.pressed
            ]}
            accessibilityLabel={t(`games.${id}.name`)}
            accessibilityRole='radio'
            accessibilityState={{ checked: isActive }}
            onPress={() => onChange(id)}
          >
            <Icon
              color={isActive ? colors.accent : colors.subtleForeground}
              size={iconSize.lg}
              strokeWidth={1.6}
            />

            <Text numberOfLines={1} style={[styles.name, isActive && styles.nameActive]}>
              {t(`games.${id}.name`)}
            </Text>

            <Text numberOfLines={2} style={styles.hint}>
              {t(`games.${id}.tagline`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
