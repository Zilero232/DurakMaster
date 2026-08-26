import { BET_STEPS } from '@durak-master/schemas';
import Slider from '@react-native-community/slider';

import { playSound } from '@/shared/lib/sound';
import { colors } from '@/ui-kit';

import type { BetSliderProps } from './BetSlider.types';

import { styles } from './BetSlider.styles';

const LAST_INDEX = BET_STEPS.length - 1;

export const BetSlider = ({ index, label, onChange }: BetSliderProps) => {
  const handleComplete = () => {
    playSound('click');
  };

  return (
    <Slider
      accessibilityLabel={label}
      maximumTrackTintColor={colors.surface3}
      maximumValue={LAST_INDEX}
      minimumTrackTintColor={colors.gold}
      minimumValue={0}
      step={1}
      style={styles.slider}
      thumbTintColor={colors.goldBright}
      value={index}
      onSlidingComplete={handleComplete}
      onValueChange={onChange}
    />
  );
};
