import { Text, View } from 'react-native';

import type { SheetHeaderProps } from './SheetHeader.types';

import { styles } from '../../Sheet.styles';

export const SheetHeader = ({ title }: SheetHeaderProps) => (
  <View style={styles.header}>
    <Text numberOfLines={1} style={styles.title}>
      {title}
    </Text>
  </View>
);
