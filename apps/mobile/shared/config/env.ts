import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const APP_SCHEME = 'durakmaster';

const SERVER_PORT = 4000;

const getDevHost = (): string | null => {
  const { hostUri } = Constants.expoConfig ?? {};

  return hostUri?.split(':')[0] ?? null;
};

const resolveApiUrl = (): string => {
  const configured = process.env.EXPO_PUBLIC_API_URL;

  if (configured) {
    return configured;
  }

  if (Platform.OS === 'web') {
    return `http://localhost:${SERVER_PORT}`;
  }

  const host = getDevHost();

  if (host) {
    return `http://${host}:${SERVER_PORT}`;
  }

  if (!__DEV__) {
    console.error('EXPO_PUBLIC_API_URL is not set for a release build — the server is unreachable');
  }

  return `http://localhost:${SERVER_PORT}`;
};

export const API_URL = resolveApiUrl();

export const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? `${API_URL.replace(/^http/, 'ws')}/ws`;

export const ARE_BOTS_ENABLED = __DEV__;
