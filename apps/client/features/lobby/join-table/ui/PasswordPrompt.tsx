'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button, Modal } from '@/shared/ui';

import s from './PasswordPrompt.module.scss';

import type { PasswordPromptProps } from './PasswordPrompt.types';

/** Ввод пароля приватного стола. */
export const PasswordPrompt = ({ isOpen, tableLabel, onSubmit, onClose }: PasswordPromptProps) => {
  const t = useTranslations('lobby');

  const [password, setPassword] = useState('');

  // Поле очищается при каждом открытии: пароль от прошлого стола
  // подставлять нельзя, а хранить его дольше нужного незачем.
  useEffect(() => {
    if (isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password.trim()) {
      onSubmit(password.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} title={t('passwordPrompt')} onClose={onClose}>
      <form className={s.root} onSubmit={handleSubmit}>
        {tableLabel && <p className={s.table}>{tableLabel}</p>}

        <input
          className={s.input}
          type="text"
          value={password}
          maxLength={32}
          autoComplete="off"
          aria-label={t('passwordPrompt')}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" variant="primary" size="lg" isFullWidth isDisabled={!password.trim()}>
          {t('join')}
        </Button>
      </form>
    </Modal>
  );
};
