export { isLegalLead as isLegalBurkozelLead } from './burkozel';
export { beats, canThrowIn, isLegalAttackCard } from './durak';
export { isTrump as isKozelTrump, legalCards as kozelLegalCards } from './kozel';
export type { GameModule, ReduceResult } from './module';

export { getGameModule, implementedGames } from './registry';
export { teamOfSeat } from './shared';
