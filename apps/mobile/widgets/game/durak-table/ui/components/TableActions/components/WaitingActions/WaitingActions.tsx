import { Bot, UserPlus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { ARE_BOTS_ENABLED } from '@/shared/config';
import { Button, iconSize } from '@/ui-kit';

import { useTableContext } from '../../../../../model';

export const WaitingActions = () => {
  const { t } = useTranslation();

  const { turn, moves } = useTableContext();

  if (!turn.hasFreeSeat) {
    return null;
  }

  return (
    <>
      {ARE_BOTS_ENABLED && (
        <Button
          icon={(color) => <Bot color={color} size={iconSize.md} />}
          variant='ghost'
          onPress={moves.onAddBot}
        >
          {t('table.addBot')}
        </Button>
      )}

      <Button
        accessibilityLabel={t('table.inviteFriendsHint')}
        icon={(color) => <UserPlus color={color} size={iconSize.md} />}
        variant='ghost'
        onPress={moves.onInviteFriends}
      >
        {t('table.inviteFriends')}
      </Button>
    </>
  );
};
