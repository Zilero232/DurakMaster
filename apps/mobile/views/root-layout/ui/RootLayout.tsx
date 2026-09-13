import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

import { SessionNotices } from '@/entities/session';
import { SocialNotices } from '@/entities/social';
import { useLayout } from '@/shared/model/layout';

import { useAppBootstrap } from '../model';
import { AppProviders } from './components';
import { rootLayoutStyles } from './RootLayout.styles';

export const RootLayout = () => {
  const isReady = useAppBootstrap();

  const { isDesktop } = useLayout();

  const insets = useSafeAreaInsets();

  if (!isReady) {
    return null;
  }

  return (
    <AppProviders>
      <StatusBar style='light' />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: rootLayoutStyles.screen,
          animation: 'fade'
        }}
      />

      <SessionNotices />

      <SocialNotices />

      <Toaster
        style={StyleSheet.flatten([
          isDesktop ? rootLayoutStyles.toastDesktop : rootLayoutStyles.toast,
          { marginTop: insets.top }
        ])}
        duration={3200}
        position='top-center'
        theme='dark'
      />
    </AppProviders>
  );
};
