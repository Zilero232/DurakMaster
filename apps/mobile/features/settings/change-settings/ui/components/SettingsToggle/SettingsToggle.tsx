import { Switch, Text, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { SettingsToggleProps } from './SettingsToggle.types';

import { styles } from './SettingsToggle.styles';

export const SettingsToggle = ({ title, description, value, onChange }: SettingsToggleProps) => (
  <View style={styles.root}>
    <View style={styles.text}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>
    </View>

    <Switch
      accessibilityLabel={title}
      thumbColor={colors.surface1}
      trackColor={{ false: colors.surface3, true: colors.gold }}
      value={value}
      onValueChange={onChange}
    />
  </View>
);
