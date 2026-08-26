import { MAX_NAME_LENGTH } from '@durak-master/schemas';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CredentialsFieldsProps } from './CredentialsFields.types';

import { FormField } from '../FormField';

export const CredentialsFields = ({ control, errors, mode, onSubmit }: CredentialsFieldsProps) => {
  const { t } = useTranslation();

  const isSignIn = mode === 'signIn';

  return (
    <>
      {!isSignIn && (
        <Controller
          render={({ field }) => (
            <FormField
              autoComplete='nickname'
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
            isInvalid={Boolean(errors.email)}
            keyboardType='email-address'
            label={t('auth.email')}
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
            secureTextEntry
            autoCapitalize='none'
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            isInvalid={Boolean(errors.password)}
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
