import { Pressable, Text } from 'react-native';

import { colors, iconSize, Toggle } from '@/ui-kit';

import type { MenuToggleProps } from './MenuToggle.types';

import { styles } from './MenuToggle.styles';

export const MenuToggle = ({ icon: Icon, label, value, onChange }: MenuToggleProps) => (
  <Pressable
    accessibilityLabel={label}
    accessibilityRole='switch'
    accessibilityState={{ checked: value }}
    style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    onPress={() => onChange(!value)}
  >
    <Icon color={colors.mutedForeground} size={iconSize.md} />

    <Text style={styles.label}>{label}</Text>

    <Toggle isOn={value} />
  </Pressable>
);
