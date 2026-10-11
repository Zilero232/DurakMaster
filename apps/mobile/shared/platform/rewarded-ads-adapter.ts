import { isEmpty, isNonNullish } from 'remeda';

import type { RewardedAdResult } from './rewarded-ads.types';

import { AD_SHOW_TIMEOUT_MS, AD_UNIT_ID, ARE_ADS_ENABLED } from './rewarded-ads.config';

const isSupported = (unitId?: string): unitId is string =>
  ARE_ADS_ENABLED && isNonNullish(unitId) && !isEmpty(unitId);

const showRewardedAd = async (unitId: string, userId: string): Promise<RewardedAdResult> => {
  const { AdEventType, RewardedAd, RewardedAdEventType } =
    await import('react-native-google-mobile-ads');

  const ad = RewardedAd.createForAdRequest(unitId, {
    serverSideVerificationOptions: { userId }
  });

  return new Promise((resolve) => {
    const unsubscribe: (() => void)[] = [];

    let hasEarned = false;
    let hasSettled = false;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const settle = (result: RewardedAdResult) => {
      if (hasSettled) {
        return;
      }

      hasSettled = true;

      if (timer) {
        clearTimeout(timer);
      }

      unsubscribe.forEach((off) => off());
      resolve(result);
    };

    timer = setTimeout(() => {
      settle({ status: 'failed', reason: 'The ad never finished' });
    }, AD_SHOW_TIMEOUT_MS);

    unsubscribe.push(
      ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        void ad.show();
      }),

      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        hasEarned = true;
      }),

      ad.addAdEventListener(AdEventType.ERROR, (error) => {
        settle({ status: 'failed', reason: error?.message ?? 'The ad failed to load' });
      }),

      ad.addAdEventListener(AdEventType.CLOSED, () => {
        settle(hasEarned ? { status: 'earned' } : { status: 'dismissed' });
      })
    );

    ad.load();
  });
};

export const rewardedAdsAdapter = {
  isAvailable: (): boolean => isSupported(AD_UNIT_ID),

  show: async (userId: string): Promise<RewardedAdResult> => {
    if (!isSupported(AD_UNIT_ID)) {
      return { status: 'unavailable' };
    }

    try {
      return await showRewardedAd(AD_UNIT_ID, userId);
    } catch (error) {
      return {
        status: 'failed',
        reason: error instanceof Error ? error.message : 'The ad failed to load'
      };
    }
  }
};
