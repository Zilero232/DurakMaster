import type { DurakRules } from '@durak-master/schemas';
import type { Control } from 'react-hook-form';

import type { CreateTableFormValues } from '../../../model';

export type MoreRulesProps = {
  control: Control<CreateTableFormValues>;
  rules: DurakRules;
  isPrivate: boolean;
};
