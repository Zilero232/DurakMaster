import { DEFAULT_CARD_THEME } from '@/ui-kit';

import type { SettingsState } from './settings-store.types';

export const STORAGE_KEY = 'durak-master.settings';

export const STORAGE_VERSION = 2;

export const INITIAL_STATE: SettingsState = {
  cardTheme: DEFAULT_CARD_THEME,
  cardScale: 'normal',
  volume: 0.7,
  isHapticsEnabled: true,
  showHints: true,
  handSort: 'trumpFirst',
  animationSpeed: 'normal',
  isBatterySaver: false,
  isHydrated: false
};
