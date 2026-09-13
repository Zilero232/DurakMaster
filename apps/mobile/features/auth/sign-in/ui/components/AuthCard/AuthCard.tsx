import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { TEST_ID } from '@/shared/config';
import { AppLogo, Button, Panel } from '@/ui-kit';

import type { AuthCardProps } from './AuthCard.types';

import { CredentialsFields } from '../CredentialsFields';
import { LOGO_SIZE } from './AuthCard.config';
import { styles } from './AuthCard.styles';

export const AuthCard = ({
  mode,
  control,
  errors,
  isSubmitting,
  onSubmit,
  onToggleMode
}: AuthCardProps) => {
  const { t } = useTranslation();

  const isSignIn = mode === 'signIn';

  return (
    <Panel elevation='floating' padding='roomy' style={styles.root}>
      <AppLogo size={LOGO_SIZE} style={styles.logo} />

      <Text style={styles.title}>{t(isSignIn ? 'auth.signInTitle' : 'auth.signUpTitle')}</Text>
      <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>

      <CredentialsFields control={control} errors={errors} mode={mode} onSubmit={onSubmit} />

      {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}

      <Button
        isFullWidth
        isLoading={isSubmitting}
        size='lg'
        testID={TEST_ID.auth.submit}
        variant='primary'
        onPress={onSubmit}
      >
        {t(isSignIn ? 'auth.signIn' : 'auth.signUp')}
      </Button>

      <Pressable accessibilityRole='button' onPress={onToggleMode}>
        <Text style={styles.switch}>
          {t(isSignIn ? 'auth.switchToSignUp' : 'auth.switchToSignIn')}
        </Text>
      </Pressable>
    </Panel>
  );
};
