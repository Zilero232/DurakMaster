import type { PushAdapter } from '@durak-master/platform';

export const pushAdapter: PushAdapter = {
  requestPermission: async (): Promise<boolean> => false,

  getToken: async (): Promise<string | null> => null,

  onTokenRefresh: (): (() => void) => () => {}
};
