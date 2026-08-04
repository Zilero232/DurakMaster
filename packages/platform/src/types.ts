/** На чём сейчас исполняется клиент. */
export type PlatformKind = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';

export type PlatformInfo = {
  kind: PlatformKind;
  isMobile: boolean;
  isTauri: boolean;
};

/** Товар магазина, каким его отдаёт стор. */
export type StoreProduct = {
  id: string;
  title: string;
  description: string;
  /** Цена, уже отформатированная стором в валюте пользователя. */
  displayPrice: string;
  /** Сколько монет начисляется. */
  coins: number;
};

export type PurchaseResult =
  | { status: 'success'; productId: string; transactionId: string; receipt: string }
  | { status: 'cancelled' }
  | { status: 'pending' }
  | { status: 'failed'; reason: string };

/**
 * Покупки. Чек ВСЕГДА проверяется на сервере — клиентскому результату
 * доверять нельзя, начисление монет делает только бэкенд после валидации.
 */
export type BillingAdapter = {
  isAvailable(): Promise<boolean>;
  getProducts(productIds: string[]): Promise<StoreProduct[]>;
  purchase(productId: string): Promise<PurchaseResult>;
  restorePurchases(): Promise<PurchaseResult[]>;
};

/** Push-уведомления: «твой ход», приглашения за стол, турниры. */
export type PushAdapter = {
  requestPermission(): Promise<boolean>;
  getToken(): Promise<string | null>;
  onTokenRefresh(handler: (token: string) => void): () => void;
};

/** Локальное хранилище настроек (звук, язык, последний стол). */
export type StorageAdapter = {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
};

export type Platform = {
  info: PlatformInfo;
  billing: BillingAdapter;
  push: PushAdapter;
  storage: StorageAdapter;
};
