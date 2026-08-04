'use client';

import { useEffect } from 'react';

import { getCardTheme } from '@/shared/lib/card-themes';
import { useSettingsStore } from './settings-store';

/**
 * Применяет тему карт к документу.
 *
 * Атрибуты пишутся в эффекте, а не при подъёме стора: `persist` срабатывает
 * до гидратации, и правка `<html>` на этом этапе даёт расхождение серверной
 * и клиентской разметки.
 */
export const useApplyCardTheme = () => {
  const cardTheme = useSettingsStore((store) => store.cardTheme);

  useEffect(() => {
    const theme = getCardTheme(cardTheme);
    const root = document.documentElement;

    root.style.setProperty('--card-filter', theme.filter ?? 'none');
    root.style.setProperty('--card-accent', theme.accent);
    root.dataset.cardTheme = theme.id;
  }, [cardTheme]);
};
