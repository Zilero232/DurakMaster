import type { MyProfile } from '@durak-master/schemas';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNonNullish } from 'remeda';
import { toast } from 'sonner-native';

import { useMyProfile } from '@/entities/session';
import { useNow } from '@/shared/model/time';
import { rewardedAdsAdapter } from '@/shared/platform';

import { READINESS_TICK_MS, REWARD_CHECK_DELAYS_MS } from './use-watch-ad.config';

type WatchStage = 'confirming' | 'idle' | 'showing';

const isBonusWaiting = (profile: MyProfile, now: number): boolean =>
  isNonNullish(profile.nextFreeCreditsAt) && profile.nextFreeCreditsAt > now;

const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const useWatchAd = () => {
  const { t } = useTranslation();

  const { profile, refetchProfile } = useMyProfile();

  const [stage, setStage] = useState<WatchStage>('idle');

  const now = useNow(READINESS_TICK_MS);

  const hasAd = rewardedAdsAdapter.isAvailable();

  const waitForReward = async (): Promise<boolean> => {
    for (const delayMs of REWARD_CHECK_DELAYS_MS) {
      await pause(delayMs);

      const fresh = await refetchProfile();

      if (fresh && !isBonusWaiting(fresh, Date.now())) {
        return true;
      }
    }

    return false;
  };

  const watchFor = async (userId: string) => {
    setStage('showing');

    const result = await rewardedAdsAdapter.show(userId);

    if (result.status === 'failed') {
      toast.error(t('profile.adFailed'));
    }

    if (result.status !== 'earned') {
      return;
    }

    setStage('confirming');

    if (await waitForReward()) {
      toast.success(t('profile.adRewarded'));
    } else {
      toast.error(t('profile.adUnconfirmed'));
    }
  };

  const watch = async () => {
    if (stage !== 'idle' || !profile) {
      return;
    }

    try {
      await watchFor(profile.userId);
    } finally {
      setStage('idle');
    }
  };

  const hasWaitToSkip = isNonNullish(profile) && isBonusWaiting(profile, now);

  return {
    isAvailable: hasAd && hasWaitToSkip,
    isBusy: stage !== 'idle',
    isConfirming: stage === 'confirming',
    watch
  };
};
