import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useSettingsStore } from '@/entities/settings';
import { restoreLocale } from '@/shared/i18n';

import { APP_FONTS } from '../../../config';

void SplashScreen.preventAutoHideAsync();

export const useAppBootstrap = (): boolean => {
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  const isSettingsReady = useSettingsStore((store) => store.isHydrated);

  const [areFontsReady] = useFonts(APP_FONTS);

  useEffect(() => {
    void restoreLocale().finally(() => {
      setIsLocaleReady(true);
    });
  }, []);

  const isReady = isLocaleReady && isSettingsReady && areFontsReady;

  useEffect(() => {
    if (isReady) {
      void SplashScreen.hideAsync();
    }
  }, [isReady]);

  return isReady;
};
