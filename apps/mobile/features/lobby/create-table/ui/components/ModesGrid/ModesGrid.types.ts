import type { ParseKeys } from 'i18next';
import type { LucideIcon } from 'lucide-react-native';
import type { Control, FieldPath } from 'react-hook-form';

import type { CreateTableFormValues } from '../../../model';

export type ModeFieldName = FieldPath<CreateTableFormValues>;

export type ModeChoiceOption<T> = {
  value: T;
  icon: LucideIcon;
  labelKey: ParseKeys;
  hintKey?: ParseKeys;
};

export type ModeChoiceField = {
  name: ModeFieldName;
  titleKey: ParseKeys;
  options: ModeChoiceOption<unknown>[];
};

export type ModeToggleField = {
  name: ModeFieldName;
  icon: LucideIcon;
  labelKey: ParseKeys;
  hintKey?: ParseKeys;
};

export type ModesGridProps = {
  choices: ModeChoiceField[];
  toggles: ModeToggleField[];
  control: Control<CreateTableFormValues>;
};
