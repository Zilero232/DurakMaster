import { MAX_NAME_LENGTH } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { NameFieldProps } from './NameField.types';

import { styles } from '../../ProfileEditor.styles';

export const NameField = ({ value, onChange }: NameFieldProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{t('profile.name')}</Text>

      <TextInput
        autoCapitalize='none'
        maxLength={MAX_NAME_LENGTH}
        placeholder={t('profile.namePlaceholder')}
        placeholderTextColor={colors.subtleForeground}
        returnKeyType='done'
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};
