import { Text, View } from 'react-native';

import type { StatRowProps } from './StatRow.types';

import { styles } from './StatRow.styles';

export const StatRow = ({ label, value, progress }: StatRowProps) => (
  <View style={styles.root}>
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>

    {progress !== undefined && (
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    )}
  </View>
);
