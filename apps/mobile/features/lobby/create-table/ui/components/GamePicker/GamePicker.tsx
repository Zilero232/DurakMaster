import { implementedGames } from '@durak-master/game-core';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { GamePickerProps } from './GamePicker.types';

import { GAME_ITEMS } from './GamePicker.config';
import { styles } from './GamePicker.styles';

const AVAILABLE_GAMES = new Set(implementedGames());

export const GamePicker = ({ value, onChange }: GamePickerProps) => {
  const { t } = useTranslation();

  return (
    <View accessibilityRole='radiogroup' style={styles.root}>
      {GAME_ITEMS.map(({ id, icon: Icon }) => {
        const isAvailable = AVAILABLE_GAMES.has(id);
        const isActive = id === value;

        return (
          <Pressable
            key={id}
            style={({ pressed }) => [
              styles.card,
              isActive && styles.active,
              !isAvailable && styles.unavailable,
              pressed && isAvailable && styles.pressed
            ]}
            accessibilityLabel={t(`games.${id}.name`)}
            accessibilityRole='radio'
            accessibilityState={{ checked: isActive, disabled: !isAvailable }}
            disabled={!isAvailable}
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
              {isAvailable ? t(`games.${id}.tagline`) : t('games.soon')}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
