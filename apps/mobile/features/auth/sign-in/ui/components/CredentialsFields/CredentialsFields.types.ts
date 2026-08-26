import type { CredentialsInput } from '@durak-master/schemas';
import type { Control, FieldErrors } from 'react-hook-form';

import type { AuthMode } from '../../SignInForm.types';

export type CredentialsFieldsProps = {
  control: Control<CredentialsInput>;
  errors: FieldErrors<CredentialsInput>;
  mode: AuthMode;
  onSubmit: () => void;
};
