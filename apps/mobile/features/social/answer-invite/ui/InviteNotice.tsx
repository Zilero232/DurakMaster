import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';
import { Avatar, Button, Sheet } from '@/ui-kit';

import { useIncomingInvite } from '../model/hooks';
import { AVATAR_SIZE, styles } from './InviteNotice.styles';

export const InviteNotice = () => {
  const { t } = useTranslation();

  const { invite, bet, accept, decline } = useIncomingInvite();

  return (
    <Sheet
      footer={
        <View style={styles.actions}>
          <Button size='lg' style={styles.action} variant='secondary' onPress={decline}>
            {t('friends.declineInvite')}
          </Button>

          <Button size='lg' style={styles.action} variant='primary' onPress={accept}>
            {t('friends.acceptInvite')}
          </Button>
        </View>
      }
      isOpen={invite !== null}
      title={t('friends.inviteReceivedTitle')}
      onClose={decline}
    >
      {invite !== null && (
        <View style={styles.root}>
          <Avatar name={invite.from.name} size={AVATAR_SIZE} src={invite.from.avatarUrl} />

          <Text style={styles.text}>{t('friends.invited', { name: invite.from.name })}</Text>

          {bet !== null && (
            <Text style={styles.bet}>{t('friends.inviteBet', { bet: formatCredits(bet) })}</Text>
          )}
        </View>
      )}
    </Sheet>
  );
};
