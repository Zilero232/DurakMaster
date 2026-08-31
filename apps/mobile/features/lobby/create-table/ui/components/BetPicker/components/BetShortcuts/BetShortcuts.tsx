import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';
import { gradientEnds, surfaceGradient } from '@/ui-kit';

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
          {isActive && (
            <LinearGradient
              colors={surfaceGradient.gold}
              end={gradientEnds.vertical.end}
              start={gradientEnds.vertical.start}
              style={styles.fill}
            />
          )}

          <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
            {formatCredits(bet)}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
