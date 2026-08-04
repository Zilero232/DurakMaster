'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { authClient } from '@/shared/api/auth/auth-client';
import { Button } from '@/shared/ui';

import s from './AuthForm.module.scss';

type Mode = 'signIn' | 'signUp';

/**
 * Вход и регистрация.
 *
 * Играть без аккаунта нельзя: за столами есть ставки и рейтинг, а значит
 * личность игрока должна быть проверяемой — иначе результат партии не к кому
 * привязать, а место за столом можно занять от чужого имени.
 */
export const AuthForm = () => {
  const t = useTranslations('auth');

  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const result =
      mode === 'signIn'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: name.trim() || email });

    setIsPending(false);

    if (result.error) {
      // Сообщения better-auth приходят на английском — показываем своё.
      setError(mode === 'signIn' ? t('errorSignIn') : t('errorSignUp'));

      return;
    }

    // Сессия установлена; подключение к игровому шлюзу поднимется само.
    window.location.reload();
  };

  return (
    <div className={s.root}>
      <form className={s.card} onSubmit={handleSubmit}>
        <h1 className={s.title}>{mode === 'signIn' ? t('signInTitle') : t('signUpTitle')}</h1>
        <p className={s.subtitle}>{t('subtitle')}</p>

        {mode === 'signUp' && (
          <label className={s.field}>
            <span className={s.label}>{t('name')}</span>
            <input
              className={s.input}
              type="text"
              value={name}
              maxLength={24}
              autoComplete="nickname"
              placeholder={t('namePlaceholder')}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        )}

        <label className={s.field}>
          <span className={s.label}>{t('email')}</span>
          <input
            className={s.input}
            type="email"
            value={email}
            required
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className={s.field}>
          <span className={s.label}>{t('password')}</span>
          <input
            className={s.input}
            type="password"
            value={password}
            required
            minLength={8}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" isFullWidth isDisabled={isPending}>
          {isPending ? t('pending') : mode === 'signIn' ? t('signIn') : t('signUp')}
        </Button>

        <button
          type="button"
          className={s.switch}
          onClick={() => {
            setMode(mode === 'signIn' ? 'signUp' : 'signIn');
            setError(null);
          }}
        >
          {mode === 'signIn' ? t('switchToSignUp') : t('switchToSignIn')}
        </button>
      </form>
    </div>
  );
};
