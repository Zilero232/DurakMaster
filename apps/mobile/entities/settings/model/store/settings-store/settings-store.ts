import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { setHapticsEnabled as applyHaptics } from '@/shared/lib/haptics';
import { setVolume as applyVolume } from '@/shared/lib/sound';

import type { SettingsStore } from './settings-store.types';

import { INITIAL_STATE, STORAGE_KEY, STORAGE_VERSION } from './settings-store.config';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

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
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: STORAGE_VERSION,

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
