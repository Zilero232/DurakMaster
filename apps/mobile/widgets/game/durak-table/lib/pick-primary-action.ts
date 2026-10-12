import type { PickPrimaryActionInput, PrimaryAction } from './pick-primary-action.types';

export const pickPrimaryAction = ({
  isWaiting,
  isReady,
  canTake,
  canPass,
  isTaking,
  isMainAttacker
}: PickPrimaryActionInput): PrimaryAction | null => {
  if (isWaiting) {
    return isReady ? 'notReady' : 'ready';
  }

  if (canTake) {
    return 'take';
  }

  if (!canPass) {
    return null;
  }

  return isTaking || !isMainAttacker ? 'pass' : 'done';
};
