import type { PublicProfile } from '@durak-master/schemas';

import { INVITE_RESEND_MS } from '@durak-master/schemas';
import { useMount } from '@siberiacancode/reactuse';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSessionStore } from '@/entities/session';
import { inviteKey, useFriends, useSocialStore } from '@/entities/social';
import { haptic } from '@/shared/lib/haptics';
import { useNow } from '@/shared/model';

const COOLDOWN_TICK_MS = 1000;

export const useInviteList = () => {
  const { t } = useTranslation();

  const currentTable = useSessionStore((store) => store.currentTable);
  const sentInvites = useSocialStore((store) => store.sentInvites);
  const inviteFriend = useSocialStore((store) => store.inviteFriend);

  const { friends, isPending, refresh } = useFriends();

  const now = useNow(COOLDOWN_TICK_MS);

  useMount(() => {
    void refresh();
  });

  const tableId = currentTable?.id ?? '';
  const seatedUserIds = new Set(currentTable?.players.map((player) => player.userId));

  const notSeated = friends.friends.filter((friend) => !seatedUserIds.has(friend.profile.userId));
  const online = notSeated.filter((friend) => friend.profile.isOnline);

  const rows = online.map((friend) => {
    const sentAt = sentInvites[inviteKey({ userId: friend.profile.userId, tableId })];
    const isInvited = sentAt !== undefined && now - sentAt < INVITE_RESEND_MS;

    return { friend, action: isInvited ? ('invited' as const) : ('invite' as const) };
  });

  const invite = (profile: PublicProfile) => {
    if (!currentTable) {
      return;
    }

    inviteFriend({ userId: profile.userId, tableId });
    haptic('win');
    toast.success(t('friends.inviteSentTo', { name: profile.name }));
  };

  return {
    rows,
    hasFriends: friends.friends.length > 0,
    offlineCount: notSeated.length - online.length,
    isPending,
    invite
  };
};
