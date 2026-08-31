import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';

import { playSound } from '@/shared/lib/sound';
import { colors } from '@/ui-kit';

import type { VolumeSliderProps } from './VolumeSlider.types';

import { STEP } from './VolumeSlider.config';
import { styles } from './VolumeSlider.styles';

export const VolumeSlider = ({ value, label, onChange }: VolumeSliderProps) => {
  const handleComplete = (next: number) => {
    onChange(next);
    playSound('play');
  };

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>

      <Slider
        accessibilityLabel={label}
        maximumTrackTintColor={colors.surface3}
        maximumValue={1}
        minimumTrackTintColor={colors.gold}
        minimumValue={0}
        step={STEP}
        style={styles.slider}
        thumbTintColor={colors.gold}
        value={value}
        onSlidingComplete={handleComplete}
        onValueChange={onChange}
      />

      <Text style={styles.value}>{`${Math.round(value * 100)}%`}</Text>
    </View>
  );
};
