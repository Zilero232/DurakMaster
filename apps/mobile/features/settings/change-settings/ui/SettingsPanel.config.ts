import type { ParseKeys } from 'i18next';

export type SettingsTab = 'look' | 'play' | 'sound';

export const SETTINGS_TABS: { id: SettingsTab; labelKey: ParseKeys }[] = [
  { id: 'play', labelKey: 'settings.tabs.play' },
  { id: 'look', labelKey: 'settings.tabs.look' },
  { id: 'sound', labelKey: 'settings.tabs.sound' }
];
