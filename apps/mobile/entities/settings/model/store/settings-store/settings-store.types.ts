import type { HandSort } from '@/shared/model/preferences';
import type { CardThemeId } from '@/ui-kit';

export type AnimationSpeed = 'calm' | 'instant' | 'normal';

export type SettingsState = {
  cardTheme: CardThemeId;

  volume: number;
  isHapticsEnabled: boolean;

  showHints: boolean;
  handSort: HandSort;
  animationSpeed: AnimationSpeed;
  isBatterySaver: boolean;

  isHydrated: boolean;
};

export type SettingsActions = {
  setCardTheme: (theme: CardThemeId) => void;
  setVolume: (value: number) => void;
  setHapticsEnabled: (value: boolean) => void;
  setShowHints: (value: boolean) => void;
  setHandSort: (sort: HandSort) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  setBatterySaver: (value: boolean) => void;
};

export type SettingsStore = SettingsActions & SettingsState;
