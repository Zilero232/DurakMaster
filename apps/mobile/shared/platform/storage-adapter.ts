import type { StorageAdapter } from '@durak-master/platform';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { isNullish } from 'remeda';

export const storageAdapter: StorageAdapter = {
  get: async <T>(key: string): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(key).catch(() => null);

    if (isNullish(raw)) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  },

  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key).catch(() => {});
  }
};
