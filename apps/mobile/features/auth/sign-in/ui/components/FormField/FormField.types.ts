import type { Ref } from 'react';
import type { TextInput, TextInputProps } from 'react-native';

export type FormFieldProps = {
  label: string;
  value: string;

  error?: string;

  isSecret?: boolean;
  ref?: Ref<TextInput>;
  onChangeText: (value: string) => void;
  onBlur: () => void;
} & Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'autoComplete'
  | 'keyboardType'
  | 'maxLength'
  | 'onSubmitEditing'
  | 'placeholder'
  | 'returnKeyType'
  | 'submitBehavior'
  | 'textContentType'
>;
