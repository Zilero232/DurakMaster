import { Text, View } from 'react-native';

import { colors, iconSize, Panel } from '@/ui-kit';

import type { SettingsSectionProps } from './SettingsSection.types';

import { styles } from './SettingsSection.styles';

export const SettingsSection = ({
  title,
  children,
  icon: Icon,
  hint,
  isInRow,
  isPlain
}: SettingsSectionProps) => {
  const body = (
    <>
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
    </>
  );

  if (isPlain) {
    return <View style={[styles.root, isInRow && styles.inRow]}>{body}</View>;
  }

  return <Panel style={[styles.root, isInRow && styles.inRow]}>{body}</Panel>;
};
