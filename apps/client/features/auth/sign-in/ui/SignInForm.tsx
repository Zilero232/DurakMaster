'use client';

import { credentialsSchema, MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH } from '@durak-master/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { authClient } from '@/shared/api/auth/auth-client';
import { Button } from '@/shared/ui';

import s from './SignInForm.module.scss';

import type { CredentialsInput } from '@durak-master/schemas';
import type { AuthMode } from './SignInForm.types';

const DEFAULT_VALUES: CredentialsInput = { email: '', password: '', name: '' };

/**
 * Вход и регистрация.
 *
 * Играть без аккаунта нельзя: за столами есть ставки и рейтинг, а значит
 * личность игрока должна быть проверяемой — иначе результат партии не к кому
 * привязать, а место за столом можно занять от чужого имени.
 */
export const SignInForm = () => {
  const t = useTranslations('auth');

  const [mode, setMode] = useState<AuthMode>('signIn');

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CredentialsInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const submit = handleSubmit(async ({ email, password, name }) => {
    const result =
      mode === 'signIn'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: name?.trim() || email });

    if (result.error) {
      // Сообщения better-auth приходят на английском — показываем своё.
      setError('root', { message: mode === 'signIn' ? t('errorSignIn') : t('errorSignUp') });

      return;
    }

    // Сессия установлена; подключение к игровому шлюзу поднимется само.
    window.location.reload();
  });

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
  };

  return (
    <div className={s.root}>
      <form className={s.card} onSubmit={submit}>
        <h1 className={s.title}>{mode === 'signIn' ? t('signInTitle') : t('signUpTitle')}</h1>
        <p className={s.subtitle}>{t('subtitle')}</p>

        {mode === 'signUp' && (
          <label className={s.field}>
            <span className={s.label}>{t('name')}</span>
            <input
              className={s.input}
              type="text"
              maxLength={MAX_NAME_LENGTH}
              autoComplete="nickname"
              placeholder={t('namePlaceholder')}
              {...register('name')}
            />
          </label>
        )}

        <label className={s.field}>
          <span className={s.label}>{t('email')}</span>
          <input
            className={s.input}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>{t('password')}</span>
          <input
            className={s.input}
            type="password"
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </label>

        {errors.root && (
          <p className={s.error} role="alert">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" isFullWidth isDisabled={isSubmitting}>
          {isSubmitting ? t('pending') : mode === 'signIn' ? t('signIn') : t('signUp')}
        </Button>

        <button type="button" className={s.switch} onClick={toggleMode}>
          {mode === 'signIn' ? t('switchToSignUp') : t('switchToSignIn')}
        </button>
      </form>
    </div>
  );
};
