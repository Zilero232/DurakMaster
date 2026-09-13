import type { CredentialsInput } from '@durak-master/schemas';

import { credentialsSchema } from '@durak-master/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '@/entities/settings';
import { authClient } from '@/shared/api';
import { LanguageSwitch } from '@/shared/i18n';
import { LobbyBackground } from '@/ui-kit';

import type { AuthMode } from './SignInForm.types';

import { AuthCard } from './components';
import { CORNER_INSET, DEFAULT_VALUES, SCROLL_PADDING_Y } from './SignInForm.config';
import { styles } from './SignInForm.styles';

export const SignInForm = () => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);

  const [mode, setMode] = useState<AuthMode>('signIn');

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError
  } = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: DEFAULT_VALUES
  });

  const isSignIn = mode === 'signIn';

  const submit = handleSubmit(async ({ email, password, name }) => {
    const result = isSignIn
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, password, name: name?.trim() || email });

    if (result.error) {
      setError('root', { message: t(isSignIn ? 'auth.errorSignIn' : 'auth.errorSignUp') });
    }
  });

  const toggleMode = () => {
    setMode(isSignIn ? 'signUp' : 'signIn');
  };

  return (
    <LobbyBackground isStatic={isBatterySaver}>
      <View style={[styles.corner, { top: insets.top + CORNER_INSET }]}>
        <LanguageSwitch />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + SCROLL_PADDING_Y,
              paddingBottom: insets.bottom + SCROLL_PADDING_Y
            }
          ]}
          keyboardShouldPersistTaps='handled'
        >
          <AuthCard
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            mode={mode}
            onSubmit={submit}
            onToggleMode={toggleMode}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </LobbyBackground>
  );
};
