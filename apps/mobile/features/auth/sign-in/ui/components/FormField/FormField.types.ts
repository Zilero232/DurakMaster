import type { TextInputProps } from 'react-native';

export type FormFieldProps = {
  label: string;
  value: string;
  isInvalid?: boolean;
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
  | 'secureTextEntry'
  | 'textContentType'
>;
