import { Text, TextInput, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { FormFieldProps } from './FormField.types';

import { styles } from './FormField.styles';

export const FormField = ({
  label,
  value,
  isInvalid = false,
  onChangeText,
  onBlur,
  ...inputProps
}: FormFieldProps) => (
  <View style={styles.root}>
    <Text style={styles.label}>{label}</Text>

    <TextInput
      placeholderTextColor={colors.subtleForeground}
      style={[styles.input, isInvalid && styles.inputInvalid]}
      value={value}
      onBlur={onBlur}
      onChangeText={onChangeText}
      {...inputProps}
    />
  </View>
);
