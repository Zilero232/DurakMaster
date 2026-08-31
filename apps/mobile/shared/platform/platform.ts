import type { Platform } from '@durak-master/platform';

import { billingAdapter } from './billing-adapter';
import { platformInfo } from './platform-info';
import { pushAdapter } from './push-adapter';
import { rewardedAdsAdapter } from './rewarded-ads-adapter';
import { storageAdapter } from './storage-adapter';

export const platform: Platform = {
  info: platformInfo,
  billing: billingAdapter,
  push: pushAdapter,
  rewardedAds: rewardedAdsAdapter,
  storage: storageAdapter
};
