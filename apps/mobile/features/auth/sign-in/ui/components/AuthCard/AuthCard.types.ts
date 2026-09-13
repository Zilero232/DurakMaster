import type { CredentialsInput } from '@durak-master/schemas';
import type { Control, FieldErrors } from 'react-hook-form';

import type { AuthMode } from '../../SignInForm.types';

export type AuthCardProps = {
  mode: AuthMode;
  control: Control<CredentialsInput>;
  errors: FieldErrors<CredentialsInput>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onToggleMode: () => void;
};
