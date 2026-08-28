import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button, Sheet } from '@/ui-kit';

import type { SignOutConfirmProps } from './SignOutConfirm.types';

import { styles } from './SignOutConfirm.styles';

export const SignOutConfirm = ({ isOpen, onCancel, onConfirm }: SignOutConfirmProps) => {
  const { t } = useTranslation();

  return (
    <Sheet isOpen={isOpen} title={t('auth.signOutTitle')} onClose={onCancel}>
      <View style={styles.root}>
        <Text style={styles.text}>{t('auth.signOutConfirm')}</Text>

        <View style={styles.actions}>
          <Button size='lg' style={styles.action} variant='secondary' onPress={onCancel}>
            {t('common.cancel')}
          </Button>

          <Button size='lg' style={styles.action} variant='danger' onPress={onConfirm}>
            {t('auth.signOut')}
          </Button>
        </View>
      </View>
    </Sheet>
  );
};
