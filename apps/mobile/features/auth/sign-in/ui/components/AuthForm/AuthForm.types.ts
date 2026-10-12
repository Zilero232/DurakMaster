import type { CredentialsInput } from '@durak-master/schemas';
import type { Control, FieldErrors, UseFormSetFocus } from 'react-hook-form';

import type { AuthMode } from '../../SignInForm.types';

export type AuthFormProps = {
  mode: AuthMode;
  control: Control<CredentialsInput>;
  errors: FieldErrors<CredentialsInput>;
  isSubmitting: boolean;
  setFocus: UseFormSetFocus<CredentialsInput>;
  onChangeMode: (mode: AuthMode) => void;
  onSubmit: () => void;
};
