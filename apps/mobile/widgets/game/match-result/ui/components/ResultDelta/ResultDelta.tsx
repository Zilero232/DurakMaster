import { Text, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { ResultDeltaProps } from './ResultDelta.types';

import { styles } from './ResultDelta.styles';

export const ResultDelta = ({ icon: Icon, label, isGain }: ResultDeltaProps) => {
  const color = isGain ? colors.success : colors.danger;

  return (
    <View style={[styles.root, { borderColor: color }]}>
      <Icon color={color} size={iconSize.md} />

      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};
