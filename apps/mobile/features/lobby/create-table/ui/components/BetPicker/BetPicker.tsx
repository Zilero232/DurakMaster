import { BET_STEPS } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';

import type { BetPickerProps } from './BetPicker.types';

import { styles } from './BetPicker.styles';

export const BetPicker = ({ value, onChange }: BetPickerProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.label}>{t('create.yourBet')}</Text>
        <Text style={styles.value}>{formatCredits(value)}</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.steps}
        showsHorizontalScrollIndicator={false}
      >
        {BET_STEPS.map((step) => {
          const isActive = step === value;

          return (
            <Pressable
              key={step}
              accessibilityLabel={t('create.betLabel')}
              accessibilityRole='radio'
              accessibilityState={{ checked: isActive }}
              style={[styles.step, isActive && styles.stepActive]}
              onPress={() => onChange(step)}
            >
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                {formatCredits(step)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
