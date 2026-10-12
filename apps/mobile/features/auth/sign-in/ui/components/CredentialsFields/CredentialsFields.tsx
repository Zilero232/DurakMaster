import { MAX_NAME_LENGTH } from '@durak-master/schemas';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { TranslationKey } from '@/shared/i18n';

import type { CredentialsFieldsProps } from './CredentialsFields.types';

import { FormField } from '../FormField';

export const CredentialsFields = ({
  control,
  errors,
  mode,
  setFocus,
  onSubmit
}: CredentialsFieldsProps) => {
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
              ref={field.ref}
              autoComplete='nickname'
              error={errorText(errors.name?.message)}
              label={t('auth.name')}
              maxLength={MAX_NAME_LENGTH}
              placeholder={t('auth.namePlaceholder')}
              returnKeyType='next'
              submitBehavior='submit'
              textContentType='nickname'
              value={field.value ?? ''}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              onSubmitEditing={() => setFocus('email')}
            />
          )}
          control={control}
          name='name'
        />
      )}

      <Controller
        render={({ field }) => (
          <FormField
            ref={field.ref}
            autoCapitalize='none'
            autoComplete='email'
            error={errorText(errors.email?.message)}
            keyboardType='email-address'
            label={t('auth.email')}
            returnKeyType='next'
            submitBehavior='submit'
            textContentType='emailAddress'
            value={field.value}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            onSubmitEditing={() => setFocus('password')}
          />
        )}
        control={control}
        name='email'
      />

      <Controller
        render={({ field }) => (
          <FormField
            isSecret
            ref={field.ref}
            autoCapitalize='none'
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            error={errorText(errors.password?.message)}
            label={t('auth.password')}
            returnKeyType='go'
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
