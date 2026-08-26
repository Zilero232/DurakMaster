import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSettingsStore } from '@/entities/settings';
import { queryClient } from '@/shared/api';
import { PRESS_FEEDBACK } from '@/shared/lib/feedback';
import { CardThemeProvider, FeedbackProvider } from '@/ui-kit';

import type { AppProvidersProps } from './AppProviders.types';

import { styles } from './AppProviders.styles';

export const AppProviders = ({ children }: AppProvidersProps) => {
  const cardTheme = useSettingsStore((store) => store.cardTheme);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <FeedbackProvider initialValue={PRESS_FEEDBACK}>
            <CardThemeProvider initialValue={cardTheme}>{children}</CardThemeProvider>
          </FeedbackProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
