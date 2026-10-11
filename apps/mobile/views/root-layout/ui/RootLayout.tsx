import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

import { SessionNotices } from '@/entities/session';
import { SocialNotices } from '@/entities/social';
import { InviteNotice } from '@/features/social/answer-invite';

import { useAppBootstrap } from '../model';
import { AppProviders } from './components';
import { rootLayoutStyles } from './RootLayout.styles';

export const RootLayout = () => {
  const isReady = useAppBootstrap();

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

      <InviteNotice />

      <Toaster
        duration={3200}
        position='top-center'
        style={StyleSheet.flatten([rootLayoutStyles.toast, { marginTop: insets.top }])}
        theme='dark'
      />
    </AppProviders>
  );
};
