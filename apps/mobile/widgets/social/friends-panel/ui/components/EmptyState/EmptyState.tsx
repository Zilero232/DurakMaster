import { Text, View } from 'react-native';

import { Button, colors, iconSize } from '@/ui-kit';

import type { EmptyStateProps } from './EmptyState.types';

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
