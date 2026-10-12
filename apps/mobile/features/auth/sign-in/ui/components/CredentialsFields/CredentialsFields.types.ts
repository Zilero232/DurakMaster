import type { CredentialsInput } from '@durak-master/schemas';
import type { Control, FieldErrors, UseFormSetFocus } from 'react-hook-form';

import type { AuthMode } from '../../SignInForm.types';

export type CredentialsFieldsProps = {
  control: Control<CredentialsInput>;
  errors: FieldErrors<CredentialsInput>;
  mode: AuthMode;
  setFocus: UseFormSetFocus<CredentialsInput>;
  onSubmit: () => void;
};
