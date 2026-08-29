import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
        duration={3200}
        position='top-center'
        style={isDesktop ? rootLayoutStyles.toastDesktop : rootLayoutStyles.toast}
        theme='dark'
      />
    </AppProviders>
  );
};
