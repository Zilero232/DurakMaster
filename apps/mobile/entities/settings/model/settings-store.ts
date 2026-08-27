import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CardScale, HandSort } from '@/shared/model/preferences';
import type { CardThemeId } from '@/ui-kit';

import { setHapticsEnabled as applyHaptics } from '@/shared/lib/haptics';
import { setVolume as applyVolume } from '@/shared/lib/sound';
import { DEFAULT_CARD_THEME } from '@/ui-kit';

export type AnimationSpeed = 'calm' | 'instant' | 'normal';

type SettingsStore = {
  cardTheme: CardThemeId;
  cardScale: CardScale;

  volume: number;
  isHapticsEnabled: boolean;

  showHints: boolean;
  handSort: HandSort;
  animationSpeed: AnimationSpeed;
  isBatterySaver: boolean;

  isHydrated: boolean;

  setCardTheme: (theme: CardThemeId) => void;
  setCardScale: (scale: CardScale) => void;
  setVolume: (value: number) => void;
  setHapticsEnabled: (value: boolean) => void;
  setShowHints: (value: boolean) => void;
  setHandSort: (sort: HandSort) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  setBatterySaver: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      cardTheme: DEFAULT_CARD_THEME,
      cardScale: 'normal',

      volume: 0.7,
      isHapticsEnabled: true,

      showHints: true,
      handSort: 'trumpFirst',
      animationSpeed: 'normal',
      isBatterySaver: false,

      isHydrated: false,

      setCardTheme: (cardTheme) => set({ cardTheme }),
      setCardScale: (cardScale) => set({ cardScale }),

      setVolume: (volume) => {
        applyVolume(volume);
        set({ volume });
      },

      setHapticsEnabled: (isHapticsEnabled) => {
        applyHaptics(isHapticsEnabled);
        set({ isHapticsEnabled });
      },

      setShowHints: (showHints) => set({ showHints }),
      setHandSort: (handSort) => set({ handSort }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
      setBatterySaver: (isBatterySaver) => set({ isBatterySaver })
    }),
    {
      name: 'durak-master.settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,

      partialize: ({
        cardTheme,
        cardScale,
        volume,
        isHapticsEnabled,
        showHints,
        handSort,
        animationSpeed,
        isBatterySaver
      }) => ({
        cardTheme,
        cardScale,
        volume,
        isHapticsEnabled,
        showHints,
        handSort,
        animationSpeed,
        isBatterySaver
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          applyVolume(state.volume);
          applyHaptics(state.isHapticsEnabled);
        }

        useSettingsStore.setState({ isHydrated: true });
      }
    }
  )
);
