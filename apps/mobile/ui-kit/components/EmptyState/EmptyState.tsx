import { Text, View } from 'react-native';

import type { EmptyStateProps } from './EmptyState.types';

import { Button } from '../../primitives';
import { colors, iconSize } from '../../theme';
import { styles } from './EmptyState.styles';

export const EmptyState = ({ icon: Icon, title, hint, action }: EmptyStateProps) => (
  <View style={styles.root}>
    <View style={styles.iconWrap}>
      <Icon color={colors.subtleForeground} size={iconSize.xl} />
    </View>

    <Text style={styles.title}>{title}</Text>

    {hint && <Text style={styles.hint}>{hint}</Text>}

    {action && (
      <Button size='lg' variant='primary' onPress={action.onPress}>
        {action.label}
      </Button>
    )}
  </View>
);
