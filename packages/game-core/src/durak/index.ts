export { decideBotAction } from './bot';

export { reduce } from './reduce';
export type { DurakReduceResult } from './reduce';

export {
  allowedThrowInRanks,
  beats,
  canAddAttackCard,
  canThrowIn,
  canTransfer,
  collectTableCards,
  computeAttackLimit,
  defendingOptions,
  handContains,
  hasDefendedCards,
  hasUndefendedCards,
  isLegalAttackCard,
  rankValue,
  removeCard
} from './rules';

export { createGame, findFirstAttackerSeat, nextActiveSeat } from './setup';
export type { CreateDurakGameInput } from './setup';

export { canDefendAnything, decideTimeoutAction } from './timeout';

export { toPlayerView, toSpectatorView } from './view';
