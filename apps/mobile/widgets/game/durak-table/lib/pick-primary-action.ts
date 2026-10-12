import type { PickPrimaryActionInput, PrimaryAction } from './pick-primary-action.types';

export const pickPrimaryAction = ({
  isWaiting,
  isReady,
  canAffordBet,
  canTake,
  canPass,
  isTaking,
  isMainAttacker
}: PickPrimaryActionInput): PrimaryAction | null => {
  if (isWaiting) {
    if (isReady) {
      return 'notReady';
    }

    return canAffordBet ? 'ready' : 'leave';
  }

  if (canTake) {
    return 'take';
  }

  if (!canPass) {
    return null;
  }

  return isTaking || !isMainAttacker ? 'pass' : 'done';
};
