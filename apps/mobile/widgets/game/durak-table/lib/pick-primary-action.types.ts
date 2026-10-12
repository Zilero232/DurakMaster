export type PrimaryAction = 'done' | 'leave' | 'notReady' | 'pass' | 'ready' | 'take';

export type PickPrimaryActionInput = {
  isWaiting: boolean;
  isReady: boolean;

  /** The balance covers the table's bet, so pressing ready can reserve it. */
  canAffordBet: boolean;
  canTake: boolean;
  canPass: boolean;

  /** The defender has already said they take, so the rest only finish throwing in. */
  isTaking: boolean;
  isMainAttacker: boolean;
};
