import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNonNullish } from 'remeda';
import { toast } from 'sonner-native';

import { useMyProfile } from '@/entities/session';
import { useNow } from '@/shared/model/time';
import { platform } from '@/shared/platform';

import { READINESS_TICK_MS } from './use-watch-ad.config';

export const useWatchAd = () => {
  const { t } = useTranslation();

  const { profile, skipBonusWait, isSkippingWait } = useMyProfile();

  const [isShowing, setIsShowing] = useState(false);

  const now = useNow(READINESS_TICK_MS);

  const watch = async () => {
    setIsShowing(true);

    const result = await platform.rewardedAds.show();

    setIsShowing(false);

    if (result.status !== 'earned') {
      if (result.status === 'failed') {
        toast.error(t('profile.adFailed'));
      }

      return;
    }

    try {
      await skipBonusWait();
      toast.success(t('profile.adRewarded'));
    } catch {
      toast.error(t('profile.adRefused'));
    }
  };

  const readyAt = profile?.nextFreeCreditsAt;

  const hasWaitToSkip = isNonNullish(readyAt) && readyAt > now;

  return {
    isAvailable: platform.rewardedAds.isAvailable() && hasWaitToSkip,
    isBusy: isShowing || isSkippingWait,
    watch
  };
};
