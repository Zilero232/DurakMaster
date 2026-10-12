import type { PlainCard } from '@durak-master/schemas';
import type { ParseKeys } from 'i18next';
import type { LucideIcon } from 'lucide-react-native';

export type RulesPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type RulesTab = 'basics' | 'modes';

export type RuleExample = {
  cards: PlainCard[];
  captionKey: ParseKeys;
};

export type RuleStepConfig = {
  id: 'deal' | 'defend' | 'draw' | 'end' | 'endBout' | 'firstMove' | 'throwIn';
  icon: LucideIcon;
  examples?: RuleExample[];
};

export type RuleFact = {
  icon: LucideIcon;
  valueKey: ParseKeys;
  labelKey: ParseKeys;
};

export type RuleMode = {
  id: 'cheaters' | 'draw' | 'jokers' | 'showTrump' | 'throwIn' | 'transfer';
  icon: LucideIcon;
};
