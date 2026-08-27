import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useSessionStore } from '@/entities/session';
import { logout } from '@/shared/api';

/**
 * The shell offers signing out from two places — the mobile header and the desktop rail —
 * and both must drop the socket before the session, otherwise the server keeps the seat.
 */
export const useSignOut = () => {
  const { t } = useTranslation();

  const disconnect = useSessionStore((store) => store.disconnect);

  return () => {
    Alert.alert(t('auth.signOutTitle'), t('auth.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.signOut'),
        style: 'destructive',
        onPress: () => {
          disconnect();
          void logout();
        }
      }
    ]);
  };
};
