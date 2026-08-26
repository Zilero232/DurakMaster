import { TABLE_PASSWORD_MAX_LENGTH } from '@durak-master/schemas';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Switch, Text, TextInput, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { PrivacySectionProps } from './PrivacySection.types';

import { styles } from './PrivacySection.styles';

export const PrivacySection = ({ control, isPrivate }: PrivacySectionProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('create.private')}</Text>

        <Controller
          render={({ field }) => (
            <Switch
              accessibilityLabel={t('create.private')}
              thumbColor={colors.surface1}
              trackColor={{ false: colors.borderStrong, true: colors.accent }}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
          control={control}
          name='isPrivate'
        />
      </View>

      {isPrivate && (
        <Controller
          render={({ field }) => (
            <TextInput
              accessibilityLabel={t('create.password')}
              autoCapitalize='none'
              autoCorrect={false}
              maxLength={TABLE_PASSWORD_MAX_LENGTH}
              placeholder={t('create.passwordPlaceholder')}
              placeholderTextColor={colors.subtleForeground}
              style={styles.password}
              value={field.value}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
            />
          )}
          control={control}
          name='password'
        />
      )}
    </View>
  );
};
