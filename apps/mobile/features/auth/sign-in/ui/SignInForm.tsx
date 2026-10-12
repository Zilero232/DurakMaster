import type { CredentialsInput } from '@durak-master/schemas';

import { credentialsSchema } from '@durak-master/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '@/entities/settings';
import { authClient } from '@/shared/api';
import { LanguageSwitch } from '@/shared/i18n';
import { LobbyBackground } from '@/ui-kit';

import type { AuthMode } from './SignInForm.types';

import { AuthForm } from './components';
import { DEFAULT_VALUES, KEYBOARD_BOTTOM_OFFSET, SCROLL_PADDING_BOTTOM } from './SignInForm.config';
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
    clearErrors,
    setError,
    setFocus
  } = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: DEFAULT_VALUES
  });

  const isSignIn = mode === 'signIn';

  const submit = handleSubmit(async ({ email, password, name }) => {
    const result = isSignIn
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({
          email,
          password,
          name: name?.trim() || email.split('@')[0]
        });

    if (result.error) {
      setError('root', { message: t(isSignIn ? 'auth.errorSignIn' : 'auth.errorSignUp') });
    }
  });

  const changeMode = (next: AuthMode) => {
    clearErrors();
    setMode(next);
  };

  return (
    <LobbyBackground isStatic={isBatterySaver} style={{ paddingTop: insets.top }}>
      <View style={styles.topBar}>
        <LanguageSwitch />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + SCROLL_PADDING_BOTTOM }
        ]}
        bottomOffset={KEYBOARD_BOTTOM_OFFSET}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        style={styles.root}
      >
        <AuthForm
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
          mode={mode}
          setFocus={setFocus}
          onChangeMode={changeMode}
          onSubmit={submit}
        />
      </KeyboardAwareScrollView>
    </LobbyBackground>
  );
};
