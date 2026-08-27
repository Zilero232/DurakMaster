import { MAX_BET, MIN_BET } from '@durak-master/schemas';
import { Coins } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { clamp } from 'remeda';

import { formatCredits } from '@/shared/lib/format';
import { colors, iconSize } from '@/ui-kit';

import type { BetInputProps } from './BetInput.types';

import { styles } from './BetInput.styles';

const onlyDigits = (text: string): string => text.replace(/\D/gu, '');

export const BetInput = ({ value, label, onChange }: BetInputProps) => {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    const typed = draft === null || draft === '' ? null : Number(draft);

    if (typed !== null) {
      onChange(clamp(typed, { min: MIN_BET, max: MAX_BET }));
    }

    setDraft(null);
  };

  return (
    <View style={styles.root}>
      <Coins color={colors.gold} size={iconSize.md} />

      <TextInput
        selectTextOnFocus
        accessibilityLabel={label}
        inputMode='numeric'
        keyboardType='number-pad'
        maxLength={8}
        style={[styles.field, draft !== null && styles.editing]}
        value={draft ?? formatCredits(value)}
        onBlur={commit}
        onChangeText={(text) => setDraft(onlyDigits(text))}
        onFocus={() => setDraft(String(value))}
        onSubmitEditing={commit}
      />
    </View>
  );
};
