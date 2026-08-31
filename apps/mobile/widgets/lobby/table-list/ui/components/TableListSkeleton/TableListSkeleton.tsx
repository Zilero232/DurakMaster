import { View } from 'react-native';

import { Skeleton } from '@/ui-kit';

import { ROWS } from './TableListSkeleton.config';
import { styles } from './TableListSkeleton.styles';

export const TableListSkeleton = () => (
  <View style={styles.root}>
    {ROWS.map((row) => (
      <View key={row} style={styles.row}>
        <View style={styles.betColumn}>
          <Skeleton height={18} width={52} />
          <Skeleton height={9} width={64} />
        </View>

        <View style={styles.main}>
          <Skeleton height={20} width='70%' />
          <Skeleton height={14} width='45%' />
        </View>
      </View>
    ))}
  </View>
);
