import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button, iconSize, InlineConfirm } from '@/ui-kit';

import { useSignOut } from '../../model';

export const SignOutButton = () => {
  const { t } = useTranslation();

  const { isConfirming, isSigningOut, request, cancel, confirm } = useSignOut();

  if (isConfirming) {
    return (
      <InlineConfirm
        confirmLabel={t('auth.signOut')}
        message={t('auth.signOutConfirm')}
        title={t('auth.signOutTitle')}
        onCancel={cancel}
        onConfirm={() => {
          void confirm();
        }}
      />
    );
  }

  return (
    <Button
      isFullWidth
      icon={(color) => <LogOut color={color} size={iconSize.md} />}
      isLoading={isSigningOut}
      size='lg'
      variant='danger'
      onPress={request}
    >
      {t('auth.signOut')}
    </Button>
  );
};
