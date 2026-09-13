import { MAX_NAME_LENGTH } from '@durak-master/schemas';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { TranslationKey } from '@/shared/i18n';

import { TEST_ID } from '@/shared/config';

import type { CredentialsFieldsProps } from './CredentialsFields.types';

import { FormField } from '../FormField';

export const CredentialsFields = ({ control, errors, mode, onSubmit }: CredentialsFieldsProps) => {
  const { t } = useTranslation();

  const errorText = (message?: string): string | undefined =>
    message ? t(message as TranslationKey) : undefined;

  const isSignIn = mode === 'signIn';

  return (
    <>
      {!isSignIn && (
        <Controller
          render={({ field }) => (
            <FormField
              autoComplete='nickname'
              error={errorText(errors.name?.message)}
              label={t('auth.name')}
              maxLength={MAX_NAME_LENGTH}
              placeholder={t('auth.namePlaceholder')}
              textContentType='nickname'
              value={field.value ?? ''}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
            />
          )}
          control={control}
          name='name'
        />
      )}

      <Controller
        render={({ field }) => (
          <FormField
            autoCapitalize='none'
            autoComplete='email'
            error={errorText(errors.email?.message)}
            keyboardType='email-address'
            label={t('auth.email')}
            testID={TEST_ID.auth.email}
            textContentType='emailAddress'
            value={field.value}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
          />
        )}
        control={control}
        name='email'
      />

      <Controller
        render={({ field }) => (
          <FormField
            isSecret
            autoCapitalize='none'
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            error={errorText(errors.password?.message)}
            label={t('auth.password')}
            returnKeyType='go'
            testID={TEST_ID.auth.password}
            textContentType={isSignIn ? 'password' : 'newPassword'}
            value={field.value}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            onSubmitEditing={onSubmit}
          />
        )}
        control={control}
        name='password'
      />
    </>
  );
};
