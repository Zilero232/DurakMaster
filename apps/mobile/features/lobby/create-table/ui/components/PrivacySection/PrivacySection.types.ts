import type { Control } from 'react-hook-form';

import type { CreateTableFormValues } from '../../../model';

export type PrivacySectionProps = {
  control: Control<CreateTableFormValues>;
  isPrivate: boolean;
};
