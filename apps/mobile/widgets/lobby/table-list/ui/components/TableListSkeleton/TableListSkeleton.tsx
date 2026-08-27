import { View } from 'react-native';

import { Skeleton } from '@/ui-kit';

import { styles } from './TableListSkeleton.styles';

const ROWS = [0, 1, 2, 3];

export const TableListSkeleton = () => (
  <View style={styles.root}>
    {ROWS.map((row) => (
      <View key={row} style={styles.row}>
        <Skeleton height={40} radius={12} width={64} />

        <View style={styles.main}>
          <Skeleton height={14} width='60%' />
          <Skeleton height={12} width='85%' />
        </View>
      </View>
    ))}
  </View>
);
