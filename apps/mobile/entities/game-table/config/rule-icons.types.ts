import type { DurakRules, GameSpeed } from '@durak-master/schemas';

export type TableRuleIcon =
  | 'bet'
  | 'deck'
  | 'draw'
  | 'jokers'
  | 'showTrump'
  | `${DurakRules['throwInScope']}Scope`
  | `${GameSpeed}Speed`
  | DurakRules['fairness']
  | DurakRules['firstMove']
  | DurakRules['mode'];
