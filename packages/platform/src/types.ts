export type PlatformKind = 'android' | 'ios' | 'web';

export type PlatformInfo = {
  kind: PlatformKind;
  isMobile: boolean;
  isNative: boolean;
};

export type StoreProduct = {
  id: string;
  title: string;
  description: string;
  displayPrice: string;
  coins: number;
};

export type PurchaseResult =
  | { status: 'cancelled' }
  | { status: 'failed'; reason: string }
  | { status: 'pending' }
  | { status: 'success'; productId: string; transactionId: string; receipt: string };

export type BillingAdapter = {
  isAvailable: () => Promise<boolean>;
  getProducts: (productIds: string[]) => Promise<StoreProduct[]>;
  purchase: (productId: string) => Promise<PurchaseResult>;
  restorePurchases: () => Promise<PurchaseResult[]>;
};

export type PushAdapter = {
  requestPermission: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  onTokenRefresh: (handler: (token: string) => void) => () => void;
};

export type StorageAdapter = {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

export type RewardedAdResult =
  | { status: 'dismissed' }
  | { status: 'earned' }
  | { status: 'failed'; reason: string }
  | { status: 'unavailable' };

export type RewardedAdsAdapter = {
  isAvailable: () => boolean;

  show: () => Promise<RewardedAdResult>;
};

export type Platform = {
  info: PlatformInfo;
  billing: BillingAdapter;
  push: PushAdapter;
  rewardedAds: RewardedAdsAdapter;
  storage: StorageAdapter;
};
