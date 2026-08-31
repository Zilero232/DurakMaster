import { TABLE_PASSWORD_MAX_LENGTH } from '@durak-master/schemas';
import { Lock, LockOpen } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Switch, Text, TextInput, View } from 'react-native';

import { colors, iconSize, Panel } from '@/ui-kit';

import type { PrivacySectionProps } from './PrivacySection.types';

import { styles } from './PrivacySection.styles';

export const PrivacySection = ({ control, isPrivate }: PrivacySectionProps) => {
  const { t } = useTranslation();

  return (
    <Panel style={styles.root}>
      <View style={styles.row}>
        {isPrivate ? (
          <Lock color={colors.accent} size={iconSize.md} />
        ) : (
          <LockOpen color={colors.subtleForeground} size={iconSize.md} />
        )}

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
          render={({ field, fieldState }) => (
            <>
              <TextInput
                accessibilityLabel={t('create.password')}
                autoCapitalize='none'
                autoCorrect={false}
                maxLength={TABLE_PASSWORD_MAX_LENGTH}
                placeholder={t('create.passwordPlaceholder')}
                placeholderTextColor={colors.subtleForeground}
                style={[styles.password, fieldState.invalid && styles.passwordInvalid]}
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
              />

              {fieldState.invalid && (
                <Text style={styles.error}>{t('create.passwordRequired')}</Text>
              )}
            </>
          )}
          control={control}
          name='password'
        />
      )}
    </Panel>
  );
};
