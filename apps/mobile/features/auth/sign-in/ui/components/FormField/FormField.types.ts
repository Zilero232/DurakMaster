import type { TextInputProps } from 'react-native';

export type FormFieldProps = {
  label: string;
  value: string;

  error?: string;

  isSecret?: boolean;
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
  | 'textContentType'
>;
