import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { AppLogo, Button, iconSize, SegmentedControl } from '@/ui-kit';

import type { AuthFormProps } from './AuthForm.types';

import { CredentialsFields } from '../CredentialsFields';
import { styles } from './AuthForm.styles';

export const AuthForm = ({
  mode,
  control,
  errors,
  isSubmitting,
  setFocus,
  onChangeMode,
  onSubmit
}: AuthFormProps) => {
  const { t } = useTranslation();

  const isSignIn = mode === 'signIn';

  const modeOptions = [
    { value: 'signIn' as const, label: t('auth.tabSignIn') },
    { value: 'signUp' as const, label: t('auth.tabSignUp') }
  ];

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <AppLogo size={iconSize.hero} />

        <Text accessibilityRole='header' style={styles.title}>
          {t(isSignIn ? 'auth.signInTitle' : 'auth.signUpTitle')}
        </Text>

        <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
      </View>

      <SegmentedControl options={modeOptions} value={mode} onChange={onChangeMode} />

      <CredentialsFields
        control={control}
        errors={errors}
        mode={mode}
        setFocus={setFocus}
        onSubmit={onSubmit}
      />

      {errors.root !== undefined && <Text style={styles.error}>{errors.root.message}</Text>}

      <Button
        isFullWidth
        isLoading={isSubmitting}
        size='lg'
        style={styles.submit}
        variant='primary'
        onPress={onSubmit}
      >
        {t(isSignIn ? 'auth.signIn' : 'auth.signUp')}
      </Button>
    </View>
  );
};
