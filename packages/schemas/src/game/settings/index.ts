export {
  burkozelRulesSchema,
  DEFAULT_BURKOZEL_RULES,
  PENALTY_FREE_THRESHOLD,
  PENALTY_LIMITS
} from './burkozel';
export type { BurkozelRules, BurkozelTeamMode } from './burkozel';

export {
  BET_STEPS,
  commonTableSettingsSchema,
  DEFAULT_COMMON_SETTINGS,
  gameSpeedSchema,
  TURN_SECONDS_BY_SPEED
} from './common';
export type { CommonTableSettings, GameSpeed } from './common';

export { DEFAULT_DURAK_RULES, durakRulesSchema, MAX_ATTACK_CARDS_PER_BOUT } from './durak';
export type { DurakMode, DurakRules, Fairness, FirstMove, ThrowInScope } from './durak';

export {
  DEFAULT_KOZEL_RULES,
  KOZEL_TARGET_PAIRS,
  KOZEL_TOTAL_POINTS,
  KOZEL_WINNING_POINTS,
  kozelRulesSchema
} from './kozel';
export type { KozelDealMode, KozelFirstLead, KozelRules } from './kozel';

export { DEFAULT_TABLE_SETTINGS, tableSettingsSchema } from './table-settings';
export type { SettingsForGame, TableSettings } from './table-settings';

export {
  barrelMinBid,
  DEFAULT_TYSYACHA_RULES,
  MIN_BID,
  TYSYACHA_BARREL_SCORE,
  TYSYACHA_WINNING_SCORES,
  tysyachaRulesSchema
} from './tysyacha';
export type { DiscardVisibility, SkipBonus, TwoPlayerMode, TysyachaRules } from './tysyacha';
