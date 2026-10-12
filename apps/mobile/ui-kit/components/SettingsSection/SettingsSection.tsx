import { Text, View } from 'react-native';

import type { SettingsSectionProps } from './SettingsSection.types';

import { Panel } from '../../primitives';
import { colors, iconSize } from '../../theme';
import { styles } from './SettingsSection.styles';

export const SettingsSection = ({
  title,
  children,
  icon: Icon,
  hint,
  isPlain
}: SettingsSectionProps) => {
  const body = (
    <>
      <View style={styles.header}>
        {Icon !== undefined && (
          <View style={styles.badge}>
            <Icon color={colors.accent} size={iconSize.sm} />
          </View>
        )}

        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>

          {hint !== undefined && <Text style={styles.hint}>{hint}</Text>}
        </View>
      </View>

      {children}
    </>
  );

  if (isPlain) {
    return <View style={styles.root}>{body}</View>;
  }

  return <Panel style={styles.root}>{body}</Panel>;
};
