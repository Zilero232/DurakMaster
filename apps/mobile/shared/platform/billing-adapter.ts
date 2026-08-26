import type { BillingAdapter, PurchaseResult, StoreProduct } from '@durak-master/platform';

export const billingAdapter: BillingAdapter = {
  isAvailable: async (): Promise<boolean> => false,

  getProducts: async (): Promise<StoreProduct[]> => [],

  purchase: async (): Promise<PurchaseResult> => ({
    status: 'failed',
    reason: 'Покупки пока недоступны'
  }),

  restorePurchases: async (): Promise<PurchaseResult[]> => []
};
