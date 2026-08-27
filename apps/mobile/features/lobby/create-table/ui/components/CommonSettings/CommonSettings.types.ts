import type { Control } from 'react-hook-form';

import type { CreateTableFormValues } from '../../../model';

export type CommonSettingsProps = {
  control: Control<CreateTableFormValues>;
  game: CreateTableFormValues['game'];
};
