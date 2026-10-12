export type PrimaryAction = 'done' | 'notReady' | 'pass' | 'ready' | 'take';

export type PickPrimaryActionInput = {
  isWaiting: boolean;
  isReady: boolean;
  canTake: boolean;
  canPass: boolean;

  /** The defender has already said they take, so the rest only finish throwing in. */
  isTaking: boolean;
  isMainAttacker: boolean;
};
