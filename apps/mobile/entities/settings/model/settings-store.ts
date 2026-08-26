import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CardThemeId } from '@/ui-kit';

import { setVolume as applyVolume } from '@/shared/lib/sound';
import { DEFAULT_CARD_THEME } from '@/ui-kit';

type SettingsStore = {
  cardTheme: CardThemeId;
  volume: number;
  showHints: boolean;
  isHapticsEnabled: boolean;
  isHydrated: boolean;

  setCardTheme: (theme: CardThemeId) => void;
  setVolume: (value: number) => void;
  setShowHints: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      cardTheme: DEFAULT_CARD_THEME,
      volume: 0.7,
      showHints: true,
      isHapticsEnabled: true,
      isHydrated: false,

      setCardTheme: (cardTheme) => set({ cardTheme }),

      setVolume: (volume) => {
        applyVolume(volume);
        set({ volume });
      },

      setShowHints: (showHints) => set({ showHints }),

      setHapticsEnabled: (isHapticsEnabled) => set({ isHapticsEnabled })
    }),
    {
      name: 'durak-master.settings',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: ({ cardTheme, volume, showHints, isHapticsEnabled }) => ({
        cardTheme,
        volume,
        showHints,
        isHapticsEnabled
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          applyVolume(state.volume);
        }

        useSettingsStore.setState({ isHydrated: true });
      }
    }
  )
);
