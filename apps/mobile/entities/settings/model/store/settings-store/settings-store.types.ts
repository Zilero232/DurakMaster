import type { CardScale, HandSort } from '@/shared/model/preferences';
import type { CardThemeId } from '@/ui-kit';

export type AnimationSpeed = 'calm' | 'instant' | 'normal';

export type SettingsState = {
  cardTheme: CardThemeId;
  cardScale: CardScale;

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
  setCardScale: (scale: CardScale) => void;
  setVolume: (value: number) => void;
  setHapticsEnabled: (value: boolean) => void;
  setShowHints: (value: boolean) => void;
  setHandSort: (sort: HandSort) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  setBatterySaver: (value: boolean) => void;
};

export type SettingsStore = SettingsActions & SettingsState;
