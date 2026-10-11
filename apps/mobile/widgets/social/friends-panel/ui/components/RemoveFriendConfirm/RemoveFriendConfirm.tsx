import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button, Sheet } from '@/ui-kit';

import type { RemoveFriendConfirmProps } from './RemoveFriendConfirm.types';

import { styles } from './RemoveFriendConfirm.styles';

export const RemoveFriendConfirm = ({ isOpen, onCancel, onConfirm }: RemoveFriendConfirmProps) => {
  const { t } = useTranslation();

  return (
    <Sheet isOpen={isOpen} title={t('friends.removeTitle')} onClose={onCancel}>
      <View style={styles.root}>
        <Text style={styles.text}>{t('friends.removeConfirm')}</Text>

        <View style={styles.actions}>
          <Button size='lg' style={styles.action} variant='secondary' onPress={onCancel}>
            {t('common.cancel')}
          </Button>

          <Button size='lg' style={styles.action} variant='danger' onPress={onConfirm}>
            {t('friends.action.remove')}
          </Button>
        </View>
      </View>
    </Sheet>
  );
};
