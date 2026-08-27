import { Pressable, Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';

import type { BetShortcutsProps } from './BetShortcuts.types';

import { BET_SHORTCUTS } from '../../BetPicker.config';
import { styles } from './BetShortcuts.styles';

export const BetShortcuts = ({ value, label, onChange }: BetShortcutsProps) => (
  <View style={styles.root}>
    {BET_SHORTCUTS.map((bet) => {
      const isActive = bet === value;

      return (
        <Pressable
          key={bet}
          accessibilityLabel={label}
          accessibilityRole='radio'
          accessibilityState={{ checked: isActive }}
          style={[styles.step, isActive && styles.stepActive]}
          onPress={() => onChange(bet)}
        >
          <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
            {formatCredits(bet)}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
