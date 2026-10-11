import { useTranslation } from 'react-i18next';

import { Sheet } from '@/ui-kit';

import type { InviteFriendsSheetProps } from './InviteFriendsSheet.types';

import { InviteList } from './components';

export const InviteFriendsSheet = ({ isOpen, onClose }: InviteFriendsSheetProps) => {
  const { t } = useTranslation();

  return (
    <Sheet isOpen={isOpen} title={t('friends.inviteTitle')} onClose={onClose}>
      <InviteList />
    </Sheet>
  );
};
