'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type CardThemeId, DEFAULT_CARD_THEME, getCardTheme } from '@/shared/lib/card-themes';
import { setVolume as applyVolume } from '@/shared/lib/sound';

type SettingsStore = {
  cardTheme: CardThemeId;
  volume: number;
  showHints: boolean;

  setCardTheme: (theme: CardThemeId) => void;
  setVolume: (value: number) => void;
  setShowHints: (value: boolean) => void;
};

const applyCardTheme = (id: CardThemeId) => {
  const theme = getCardTheme(id);
  const root = document.documentElement;

  root.style.setProperty('--card-filter', theme.filter ?? 'none');
  root.style.setProperty('--card-accent', theme.accent);
  root.dataset.cardTheme = theme.id;
};

/**
 * Оформление и удобства. Живут локально, а не на сервере: на исход партии
 * не влияют и должны применяться мгновенно даже без сети.
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      cardTheme: DEFAULT_CARD_THEME,
      volume: 0.7,
      showHints: true,

      setCardTheme: (cardTheme) => {
        applyCardTheme(cardTheme);
        set({ cardTheme });
      },

      setVolume: (volume) => {
        applyVolume(volume);
        set({ volume });
      },

      setShowHints: (showHints) => set({ showHints }),
    }),
    {
      name: 'durak-master.settings',
      // Тема и громкость живут вне React — их нужно применить к DOM
      // и аудиоконтексту сразу после подъёма из хранилища.
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyCardTheme(state.cardTheme);
          applyVolume(state.volume);
        }
      },
    },
  ),
);
