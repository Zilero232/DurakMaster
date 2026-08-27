import { Pressable, Text } from 'react-native';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';
import { colors, iconSize, SuitIcon } from '@/ui-kit';

import type { RailItemProps } from './RailItem.types';

import { styles } from './RailItem.styles';

export const RailItem = ({ label, suit, isActive, onPress }: RailItemProps) => (
  <Pressable
    accessibilityRole='tab'
    accessibilityState={{ selected: isActive }}
    style={({ pressed }) => [styles.root, isActive && styles.active, pressed && styles.pressed]}
    onPress={() => {
      playSound('click');
      haptic('tap');
      onPress();
    }}
  >
    <SuitIcon color={isActive ? colors.gold : colors.onFeltMuted} size={iconSize.lg} suit={suit} />

    <Text numberOfLines={1} style={[styles.label, isActive && styles.labelActive]}>
      {label}
    </Text>
  </Pressable>
);
