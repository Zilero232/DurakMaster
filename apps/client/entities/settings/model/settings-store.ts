'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type CardThemeId, DEFAULT_CARD_THEME } from '@/shared/lib/card-themes';
import { setVolume as applyVolume } from '@/shared/lib/sound';

type SettingsStore = {
  cardTheme: CardThemeId;
  volume: number;
  showHints: boolean;

  setCardTheme: (theme: CardThemeId) => void;
  setVolume: (value: number) => void;
  setShowHints: (value: boolean) => void;
};

/**
 * Оформление и удобства. Живут локально, а не на сервере: на исход партии
 * не влияют и должны применяться мгновенно даже без сети.
 *
 * Стор НЕ трогает DOM: `persist` поднимает состояние до гидратации React,
 * и запись атрибутов в `<html>` на этом этапе ломает совпадение разметки.
 * Тему к документу применяет `useApplyCardTheme` уже после монтирования.
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      cardTheme: DEFAULT_CARD_THEME,
      volume: 0.7,
      showHints: true,

      setCardTheme: (cardTheme) => set({ cardTheme }),

      setVolume: (volume) => {
        applyVolume(volume);
        set({ volume });
      },

      setShowHints: (showHints) => set({ showHints }),
    }),
    {
      name: 'durak-master.settings',
      // Громкость живёт в аудиоконтексте вне React — её достаточно
      // восстановить сразу, к разметке она отношения не имеет.
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyVolume(state.volume);
        }
      },
    },
  ),
);
