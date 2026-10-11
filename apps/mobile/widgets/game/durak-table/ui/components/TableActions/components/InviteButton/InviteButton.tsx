import { UserPlus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, iconSize } from '@/ui-kit';

import { useTableContext } from '../../../../../model';
import { styles } from '../../TableActions.styles';

export const InviteButton = () => {
  const { t } = useTranslation();

  const { moves } = useTableContext();

  return (
    <View style={styles.inviteSlot}>
      <Button
        accessibilityLabel={t('table.inviteFriendsHint')}
        icon={(color) => <UserPlus color={color} size={iconSize.md} />}
        style={styles.action}
        variant='ghost'
        onPress={moves.onInviteFriends}
      >
        {t('table.inviteFriends')}
      </Button>
    </View>
  );
};
