import { Text, View } from 'react-native';

import type { SettingsSectionProps } from './SettingsSection.types';

import { styles } from './SettingsSection.styles';

export const SettingsSection = ({ title, children }: SettingsSectionProps) => (
  <View style={styles.root}>
    <Text style={styles.title}>{title}</Text>

    {children}
  </View>
);
