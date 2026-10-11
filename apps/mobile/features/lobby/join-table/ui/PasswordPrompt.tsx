import { TABLE_PASSWORD_MAX_LENGTH } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';

import { Button, colors, Sheet } from '@/ui-kit';

import type { PasswordPromptProps } from './PasswordPrompt.types';

import { usePasswordEntry } from '../model/hooks';
import { styles } from './PasswordPrompt.styles';

export const PasswordPrompt = ({ isOpen, onSubmit, onClose }: PasswordPromptProps) => {
  const { t } = useTranslation();

  const { password, inputRef, canSubmit, isJoining, setPassword, submit, close } = usePasswordEntry(
    { isOpen, onSubmit, onClose }
  );

  return (
    <Sheet
      footer={
        <Button
          isFullWidth
          isDisabled={!canSubmit}
          isLoading={isJoining}
          size='lg'
          variant='primary'
          onPress={submit}
        >
          {t('lobby.join')}
        </Button>
      }
      isOpen={isOpen}
      title={t('lobby.passwordPrompt')}
      onClose={close}
    >
      <TextInput
        secureTextEntry
        ref={inputRef}
        accessibilityLabel={t('lobby.passwordPrompt')}
        autoCapitalize='none'
        autoCorrect={false}
        maxLength={TABLE_PASSWORD_MAX_LENGTH}
        placeholderTextColor={colors.subtleForeground}
        returnKeyType='go'
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={submit}
      />
    </Sheet>
  );
};
