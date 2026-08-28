import type { DurakDeckSize } from '@durak-master/schemas';
import type { Control } from 'react-hook-form';

import type { CreateTableFormValues } from '../../../model';

export type CommonSettingsProps = {
  control: Control<CreateTableFormValues>;
  deckSize: DurakDeckSize;
  game: CreateTableFormValues['game'];
};
