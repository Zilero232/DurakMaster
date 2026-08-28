import { BET_STEPS } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';

import type { BetPickerProps } from './BetPicker.types';

import { styles } from './BetPicker.styles';
import { BetInput, BetShortcuts, BetSlider } from './components';

const LAST_INDEX = BET_STEPS.length - 1;

export const BetPicker = ({ value, onChange }: BetPickerProps) => {
  const { t } = useTranslation();

  const index = BET_STEPS.reduce(
    (best, step, at) =>
      Math.abs(step - value) < Math.abs((BET_STEPS[best] ?? 0) - value) ? at : best,
    0
  );

  const label = t('create.betLabel');

  const selectIndex = (next: number) => {
    onChange(BET_STEPS[next] ?? BET_STEPS[0]);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.label}>{t('create.yourBet')}</Text>

        <BetInput key={value} label={label} value={value} onChange={onChange} />
      </View>

      <View>
        <BetSlider index={index} label={label} onChange={selectIndex} />

        <View style={styles.bounds}>
          <Text style={styles.bound}>{formatCredits(BET_STEPS[0])}</Text>
          <Text style={styles.bound}>{formatCredits(BET_STEPS[LAST_INDEX])}</Text>
        </View>
      </View>

      <BetShortcuts label={label} value={value} onChange={onChange} />
    </View>
  );
};
