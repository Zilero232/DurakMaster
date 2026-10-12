import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

import { SessionNotices, useSessionStore } from '@/entities/session';
import { SocialNotices } from '@/entities/social';
import { InviteNotice } from '@/features/social/answer-invite';

import { useAppBootstrap } from '../model';
import { AppProviders } from './components';
import { rootLayoutStyles } from './RootLayout.styles';

export const RootLayout = () => {
  const isReady = useAppBootstrap();

  const insets = useSafeAreaInsets();

  const isAtTable = useSessionStore((store) => store.currentTable !== null);

  const toastStyle = StyleSheet.flatten([
    rootLayoutStyles.toast,
    { marginTop: isAtTable ? 0 : insets.top }
  ]);

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
        position={isAtTable ? 'center' : 'top-center'}
        style={toastStyle}
        theme='dark'
      />
    </AppProviders>
  );
};
