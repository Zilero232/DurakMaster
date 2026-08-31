import { Text, View } from 'react-native';

import { colors, iconSize, Panel } from '@/ui-kit';

import type { SettingsSectionProps } from './SettingsSection.types';

import { styles } from './SettingsSection.styles';

export const SettingsSection = ({ title, children, icon: Icon, hint }: SettingsSectionProps) => (
  <Panel style={styles.root}>
    <View style={styles.header}>
      {Icon && (
        <View style={styles.badge}>
          <Icon color={colors.accent} size={iconSize.sm} />
        </View>
      )}

      <View style={styles.heading}>
        <Text style={styles.title}>{title}</Text>

        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
    </View>

    {children}
  </Panel>
);
