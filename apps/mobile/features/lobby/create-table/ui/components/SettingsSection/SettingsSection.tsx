import { Text, View } from 'react-native';

import type { SettingsSectionProps } from './SettingsSection.types';

import { styles } from './SettingsSection.styles';

export const SettingsSection = ({ title, children, isInRow }: SettingsSectionProps) => (
  <View style={[styles.root, isInRow && styles.inRow]}>
    <Text style={styles.title}>{title}</Text>
    {children}
  </View>
);
