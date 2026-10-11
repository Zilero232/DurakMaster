import { INVITE_TTL_MS } from '@durak-master/schemas';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { useSessionStore } from '@/entities/session';
import { useSocialStore } from '@/entities/social';
import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

export const useIncomingInvite = () => {
  const { t } = useTranslation();

  const invite = useSocialStore((store) => store.invite);
  const setInvite = useSocialStore((store) => store.setInvite);
  const currentTable = useSessionStore((store) => store.currentTable);
  const tables = useSessionStore((store) => store.tables);
  const outcome = useSessionStore((store) => store.outcome);
  const joinTable = useSessionStore((store) => store.joinTable);
  const goToMenu = useSessionStore((store) => store.goToMenu);

  const isPlaying = currentTable?.status === 'playing';
  const isAlreadyThere = invite !== null && currentTable?.id === invite.tableId;

  useEffect(() => {
    if (!invite) {
      return;
    }

    playSound('invite');
    haptic('tap');

    const expiry = setTimeout(setInvite, INVITE_TTL_MS, null);

    return () => clearTimeout(expiry);
  }, [invite, setInvite]);

  useEffect(() => {
    if (!invite || (!isPlaying && !isAlreadyThere)) {
      return;
    }

    if (isPlaying) {
      toast(t('friends.invitedWhilePlaying', { name: invite.from.name }));
    }

    setInvite(null);
  }, [invite, isPlaying, isAlreadyThere, t, setInvite]);

  const table = tables.find((item) => item.id === invite?.tableId) ?? null;

  const accept = () => {
    if (!invite) {
      return;
    }

    if (outcome) {
      goToMenu();
    }

    joinTable(invite.tableId);
    setInvite(null);
  };

  const decline = () => {
    setInvite(null);
  };

  return {
    invite: isPlaying || isAlreadyThere ? null : invite,
    bet: table?.settings.bet ?? null,
    accept,
    decline
  };
};
