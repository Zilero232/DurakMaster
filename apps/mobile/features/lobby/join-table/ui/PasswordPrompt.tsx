import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from 'react-native';

import { Button, colors, Sheet } from '@/ui-kit';

import type { PasswordPromptProps } from './PasswordPrompt.types';

import { styles } from './PasswordPrompt.styles';

const PASSWORD_MAX_LENGTH = 32;

export const PasswordPrompt = ({ isOpen, tableLabel, onSubmit, onClose }: PasswordPromptProps) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState('');

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = password.trim();

    if (trimmed) {
      setPassword('');
      onSubmit(trimmed);
    }
  };

  return (
    <Sheet
      footer={
        <Button
          isFullWidth
          isDisabled={!password.trim()}
          size='lg'
          variant='primary'
          onPress={handleSubmit}
        >
          {t('lobby.join')}
        </Button>
      }
      isOpen={isOpen}
      title={t('lobby.passwordPrompt')}
      onClose={handleClose}
    >
      {tableLabel && <Text style={styles.table}>{tableLabel}</Text>}

      <TextInput
        secureTextEntry
        ref={inputRef}
        accessibilityLabel={t('lobby.passwordPrompt')}
        autoCapitalize='none'
        autoCorrect={false}
        maxLength={PASSWORD_MAX_LENGTH}
        placeholderTextColor={colors.subtleForeground}
        returnKeyType='go'
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleSubmit}
      />
    </Sheet>
  );
};
