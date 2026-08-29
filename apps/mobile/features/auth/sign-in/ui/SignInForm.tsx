import type { CredentialsInput } from '@durak-master/schemas';

import { credentialsSchema } from '@durak-master/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '@/entities/settings';
import { authClient } from '@/shared/api';
import { LanguageSwitch } from '@/shared/i18n';
import { Button, LobbyBackground } from '@/ui-kit';

import type { AuthMode } from './SignInForm.types';

import { CredentialsFields } from './components';
import { CORNER_INSET, styles } from './SignInForm.styles';

const DEFAULT_VALUES: CredentialsInput = { email: '', password: '', name: '' };

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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>
          <View style={styles.card}>
            <Text style={styles.title}>
              {t(isSignIn ? 'auth.signInTitle' : 'auth.signUpTitle')}
            </Text>
            <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>

            <CredentialsFields control={control} errors={errors} mode={mode} onSubmit={submit} />

            {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

            <Button
              isFullWidth
              isLoading={isSubmitting}
              size='lg'
              variant='primary'
              onPress={submit}
            >
              {t(isSignIn ? 'auth.signIn' : 'auth.signUp')}
            </Button>

            <Pressable accessibilityRole='button' onPress={toggleMode}>
              <Text style={styles.switch}>
                {t(isSignIn ? 'auth.switchToSignUp' : 'auth.switchToSignIn')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LobbyBackground>
  );
};
