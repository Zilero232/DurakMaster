import type { TextInput } from 'react-native';

import { useEffect, useRef, useState } from 'react';

import { useSessionStore } from '@/entities/session';

import type { UsePasswordEntryInput } from './use-password-entry.types';

export const usePasswordEntry = ({ isOpen, onSubmit, onClose }: UsePasswordEntryInput) => {
  const isJoining = useSessionStore((store) => store.isJoiningTable);

  const [password, setPassword] = useState('');

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const trimmed = password.trim();
  const canSubmit = Boolean(trimmed) && !isJoining;

  const close = () => {
    setPassword('');
    onClose();
  };

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    setPassword('');
    onSubmit(trimmed);
  };

  return { password, inputRef, canSubmit, isJoining, setPassword, submit, close };
};
