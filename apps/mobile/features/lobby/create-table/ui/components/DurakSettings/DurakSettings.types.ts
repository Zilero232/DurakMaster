import type { DurakRules } from '@durak-master/schemas';
import type { Control } from 'react-hook-form';

import type { CreateTableFormValues } from '../../../model';

export type DurakSettingsProps = {
  control: Control<CreateTableFormValues>;
};

export type DurakModesSectionProps = DurakSettingsProps & {
  mode: DurakRules['mode'];
};
