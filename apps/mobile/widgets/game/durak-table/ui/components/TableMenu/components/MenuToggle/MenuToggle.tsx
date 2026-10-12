import { Switch, Text, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { MenuToggleProps } from './MenuToggle.types';

import { styles } from './MenuToggle.styles';

export const MenuToggle = ({ icon: Icon, label, value, onChange }: MenuToggleProps) => (
  <View style={styles.root}>
    <Icon color={colors.mutedForeground} size={iconSize.md} />

    <Text style={styles.label}>{label}</Text>

    <Switch
      accessibilityLabel={label}
      thumbColor={colors.surface1}
      trackColor={{ false: colors.surface3, true: colors.gold }}
      value={value}
      onValueChange={onChange}
    />
  </View>
);
