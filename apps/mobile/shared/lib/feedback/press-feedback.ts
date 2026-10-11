import { haptic } from '../haptics';
import { playSound } from '../sound';

export const PRESS_FEEDBACK = {
  onPress: () => {
    playSound('click');
    haptic('tap');
  }
};
