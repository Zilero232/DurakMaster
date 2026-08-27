import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { FormFieldProps } from './FormField.types';

import { styles } from './FormField.styles';

export const FormField = ({
  label,
  value,
  error,
  isSecret = false,
  onChangeText,
  onBlur,
  ...inputProps
}: FormFieldProps) => {
  const { t } = useTranslation();

  const [isRevealed, setIsRevealed] = useState(false);

  const toggleReveal = () => {
    setIsRevealed((previous) => !previous);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.field, Boolean(error) && styles.fieldInvalid]}>
        <TextInput
          placeholderTextColor={colors.subtleForeground}
          secureTextEntry={isSecret && !isRevealed}
          style={styles.input}
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          {...inputProps}
        />

        {isSecret && (
          <Pressable
            accessibilityLabel={t(isRevealed ? 'auth.hidePassword' : 'auth.showPassword')}
            accessibilityRole='button'
            hitSlop={12}
            style={styles.reveal}
            onPress={toggleReveal}
          >
            {isRevealed ? (
              <EyeOff color={colors.subtleForeground} size={iconSize.md} />
            ) : (
              <Eye color={colors.subtleForeground} size={iconSize.md} />
            )}
          </Pressable>
        )}
      </View>

      {Boolean(error) && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
