import type { DurakRules } from '@durak-master/schemas';

import type { TranslationKey } from '@/shared/i18n';

export type DescribeRulesInput = {
  rules: DurakRules;
  isPrivate: boolean;
};

export type RulesSummaryPart = {
  key: TranslationKey;
  count?: number;
};
