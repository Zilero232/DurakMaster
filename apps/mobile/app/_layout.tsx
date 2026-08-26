import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_800ExtraBold
} from '@expo-google-fonts/nunito';
import { Rubik_600SemiBold, Rubik_800ExtraBold } from '@expo-google-fonts/rubik';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

import { SessionNotices } from '@/entities/session';
import { useSettingsStore } from '@/entities/settings';
import { restoreLocale } from '@/shared/i18n';
import { haptic } from '@/shared/lib/haptics';
import { playSound, unlockSound } from '@/shared/lib/sound';
import { CardThemeProvider, FeedbackProvider } from '@/ui-kit';
import { rootLayoutStyles } from '@/views/root-layout';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const PRESS_FEEDBACK = {
  onPress: () => {
    unlockSound();
    playSound('click');
    haptic('tap');
  }
};

const RootLayout = () => {
  const [isLocaleReady, setIsLocaleReady] = useState(false);

  const isSettingsReady = useSettingsStore((store) => store.isHydrated);
  const cardTheme = useSettingsStore((store) => store.cardTheme);

  const [areFontsReady] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
    Rubik_600SemiBold,
    Rubik_800ExtraBold
  });

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

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={rootLayoutStyles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <FeedbackProvider initialValue={PRESS_FEEDBACK}>
            <CardThemeProvider initialValue={cardTheme}>
              <StatusBar style='light' />

              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: rootLayoutStyles.screen,
                  animation: 'fade'
                }}
              />

              <SessionNotices />

              <Toaster duration={3200} position='top-center' theme='light' />
            </CardThemeProvider>
          </FeedbackProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
