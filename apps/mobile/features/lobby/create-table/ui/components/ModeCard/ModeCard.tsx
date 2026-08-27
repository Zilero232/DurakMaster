import { Pressable, Text } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { ModeCardProps } from './ModeCard.types';

import { styles } from './ModeCard.styles';

export const ModeCard = ({ icon: Icon, label, hint, isActive, onPress }: ModeCardProps) => (
  <Pressable
    accessibilityRole='radio'
    accessibilityState={{ checked: isActive }}
    style={({ pressed }) => [styles.root, isActive && styles.active, pressed && styles.pressed]}
    onPress={onPress}
  >
    <Icon
      color={isActive ? colors.accent : colors.subtleForeground}
      size={iconSize.lg}
      strokeWidth={1.6}
    />

    <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    {hint && <Text style={styles.hint}>{hint}</Text>}
  </Pressable>
);
