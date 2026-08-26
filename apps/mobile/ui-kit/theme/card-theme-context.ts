import { createContext } from '@siberiacancode/reactuse';

import type { CardTheme, CardThemeId } from './card-themes';

import { DEFAULT_CARD_THEME, getCardTheme } from './card-themes';

const { Provider, useSelect } = createContext<CardThemeId>(DEFAULT_CARD_THEME);

export const CardThemeProvider = Provider;

export const useCardTheme = (): CardTheme => {
  const { value } = useSelect();

  return getCardTheme(value ?? DEFAULT_CARD_THEME);
};

export const useSetCardTheme = (): ((themeId: CardThemeId) => void) => {
  const { set } = useSelect();

  return set;
};
