import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { ModeCardProps } from './ModeCard.types';

import { styles } from './ModeCard.styles';

export const ModeCard = ({ icon: Icon, label, hint, isActive, onPress }: ModeCardProps) => (
  <Pressable
    accessibilityRole='button'
    accessibilityState={{ selected: isActive }}
    style={({ pressed }) => [styles.root, isActive && styles.active, pressed && styles.pressed]}
    onPress={onPress}
  >
    {isActive && (
      <View style={styles.check}>
        <Check color={colors.primaryForeground} size={13} strokeWidth={3} />
      </View>
    )}

    <Icon color={isActive ? colors.accent : colors.subtleForeground} size={26} strokeWidth={1.6} />

    <Text style={styles.label}>{label}</Text>
    {hint && <Text style={styles.hint}>{hint}</Text>}
  </Pressable>
);
