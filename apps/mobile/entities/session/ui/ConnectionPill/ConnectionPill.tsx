import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { duration } from '@/ui-kit';

import type { ConnectionPillProps } from './ConnectionPill.types';

import { styles } from './ConnectionPill.styles';

export const ConnectionPill = ({ status, style }: ConnectionPillProps) => {
  const { t } = useTranslation();

  if (status === 'connected') {
    return null;
  }

  const isOffline = status === 'error';

  return (
    <Animated.View
      accessibilityLiveRegion='polite'
      entering={FadeIn.duration(duration.fast)}
      exiting={FadeOut.duration(duration.fast)}
      pointerEvents='none'
      style={[styles.root, style]}
    >
      <View style={[styles.dot, isOffline ? styles.offline : styles.connecting]} />

      <Text numberOfLines={1} style={styles.label}>
        {t(isOffline ? 'connection.offline' : 'connection.connecting')}
      </Text>
    </Animated.View>
  );
};
