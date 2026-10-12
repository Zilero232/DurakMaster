import { Pressable, Text, View } from 'react-native';

import { Panel, Toggle } from '@/ui-kit';

import type { SettingsToggleProps } from './SettingsToggle.types';

import { styles } from './SettingsToggle.styles';

export const SettingsToggle = ({ title, description, value, onChange }: SettingsToggleProps) => (
  <Pressable
    accessibilityLabel={title}
    accessibilityRole='switch'
    accessibilityState={{ checked: value }}
    onPress={() => onChange(!value)}
  >
    {({ pressed }) => (
      <Panel style={[styles.root, pressed && styles.pressed]}>
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.description}>{description}</Text>
        </View>

        <Toggle isOn={value} />
      </Panel>
    )}
  </Pressable>
);
