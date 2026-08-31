import type { RewardedAdResult, RewardedAdsAdapter } from '@durak-master/platform';

import { isEmpty, isNonNullish } from 'remeda';

import { platformInfo } from './platform-info';
import { AD_SHOW_TIMEOUT_MS, AD_UNIT_ID, DEMO_AD_UNIT_ID } from './rewarded-ads.config';

const adUnitId = __DEV__ ? DEMO_AD_UNIT_ID : AD_UNIT_ID;

const isSupported = (unitId?: string): unitId is string =>
  platformInfo.kind === 'android' && isNonNullish(unitId) && !isEmpty(unitId);

const showRewardedAd = async (unitId: string): Promise<RewardedAdResult> => {
  const { RewardedAdLoader } = await import('yandex-mobile-ads');

  const loader = await RewardedAdLoader.create();
  const ad = await loader.loadAd({ adUnitId: unitId });

  return new Promise((resolve) => {
    let hasEarned = false;

    const timer = setTimeout(() => {
      resolve({ status: 'failed', reason: 'The ad never finished' });
    }, AD_SHOW_TIMEOUT_MS);

    const settle = (result: RewardedAdResult) => {
      clearTimeout(timer);
      resolve(result);
    };

    ad.onRewarded = () => {
      hasEarned = true;
    };

    ad.onAdFailedToShow = (error) => {
      settle({ status: 'failed', reason: error?.description ?? 'The ad failed to show' });
    };

    ad.onAdDismissed = () => {
      settle(hasEarned ? { status: 'earned' } : { status: 'dismissed' });
    };

    void ad.show();
  });
};

export const rewardedAdsAdapter: RewardedAdsAdapter = {
  isAvailable: () => isSupported(adUnitId),

  show: async () => {
    if (!isSupported(adUnitId)) {
      return { status: 'unavailable' };
    }

    try {
      return await showRewardedAd(adUnitId);
    } catch (error) {
      return {
        status: 'failed',
        reason: error instanceof Error ? error.message : 'The ad failed to load'
      };
    }
  }
};
