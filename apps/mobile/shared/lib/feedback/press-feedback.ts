import { haptic } from '../haptics';
import { playSound, unlockSound } from '../sound';

export const PRESS_FEEDBACK = {
  onPress: () => {
    unlockSound();
    playSound('click');
    haptic('tap');
  }
};
