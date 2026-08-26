import { getAchievement } from '@durak-master/schemas';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

import { useSocialStore } from '../../model/social-store';

export const SocialNotices = () => {
  const { t } = useTranslation();

  const invite = useSocialStore((store) => store.invite);
  const setInvite = useSocialStore((store) => store.setInvite);
  const freshlyUnlocked = useSocialStore((store) => store.freshlyUnlocked);
  const clearFreshlyUnlocked = useSocialStore((store) => store.clearFreshlyUnlocked);

  useEffect(() => {
    if (!invite) {
      return;
    }

    playSound('click');
    toast(t('friends.invited', { name: invite.from.name }));
    setInvite(null);
  }, [invite, t, setInvite]);

  useEffect(() => {
    if (freshlyUnlocked.length === 0) {
      return;
    }

    for (const id of freshlyUnlocked) {
      const reward = getAchievement(id)?.reward ?? 0;

      toast.success(
        t('achievements.unlockedToast', { title: t(`achievements.${id}.title`), reward })
      );
    }

    playSound('win');
    haptic('win');
    clearFreshlyUnlocked();
  }, [freshlyUnlocked, t, clearFreshlyUnlocked]);

  return null;
};
