import { Pressable, Text, View } from 'react-native';

import { PlayingCard } from '@/ui-kit';

import type { ThemeOptionProps } from './ThemeOption.types';

import { PREVIEW_CARD } from './ThemeOption.config';
import { PREVIEW_CARD_WIDTH, styles } from './ThemeOption.styles';

export const ThemeOption = ({ theme, label, isActive, onPress }: ThemeOptionProps) => (
  <Pressable
    accessibilityLabel={label}
    accessibilityRole='radio'
    accessibilityState={{ selected: isActive }}
    style={({ pressed }) => [styles.root, isActive && styles.active, pressed && styles.pressed]}
    onPress={onPress}
  >
    <View style={styles.preview}>
      <PlayingCard card={null} style={styles.back} theme={theme} width={PREVIEW_CARD_WIDTH} />

      <PlayingCard
        card={PREVIEW_CARD}
        style={styles.face}
        theme={theme}
        width={PREVIEW_CARD_WIDTH}
      />
    </View>

    <Text numberOfLines={1} style={[styles.name, isActive && styles.activeName]}>
      {label}
    </Text>
  </Pressable>
);
