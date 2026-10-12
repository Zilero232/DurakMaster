import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { InlineConfirmProps } from './InlineConfirm.types';

import { Button } from '../../primitives';
import { styles } from './InlineConfirm.styles';

export const InlineConfirm = ({
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm
}: InlineConfirmProps) => {
  const { t } = useTranslation();

  return (
    <View accessibilityLiveRegion='polite' style={styles.root}>
      <Text accessibilityRole='header' style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.actions}>
        <Button size='lg' style={styles.action} variant='secondary' onPress={onCancel}>
          {t('common.cancel')}
        </Button>

        <Button size='lg' style={styles.action} variant='danger' onPress={onConfirm}>
          {confirmLabel}
        </Button>
      </View>
    </View>
  );
};
