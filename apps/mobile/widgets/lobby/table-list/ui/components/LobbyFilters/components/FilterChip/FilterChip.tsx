import { Pressable, Text } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { FilterChipProps } from './FilterChip.types';

import { styles } from '../../LobbyFilters.styles';

export const FilterChip = ({
  label,
  isActive,
  icon: Icon,
  accessibilityRole = 'radio',
  onPress
}: FilterChipProps) => (
  <Pressable
    accessibilityRole={accessibilityRole}
    accessibilityState={{ checked: isActive }}
    style={[styles.chip, isActive && styles.chipActive]}
    onPress={onPress}
  >
    {Icon && (
      <Icon
        color={isActive ? colors.primaryForeground : colors.mutedForeground}
        size={iconSize.xs}
      />
    )}

    <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{label}</Text>
  </Pressable>
);
