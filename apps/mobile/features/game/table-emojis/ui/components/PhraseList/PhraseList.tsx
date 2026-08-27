import { QUICK_PHRASES } from '@durak-master/schemas';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import type { PhraseListProps } from './PhraseList.types';

import { styles } from './PhraseList.styles';

export const PhraseList = ({ onSelect }: PhraseListProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      {QUICK_PHRASES.map((phraseId) => (
        <Pressable
          key={phraseId}
          accessibilityRole='button'
          style={({ pressed }) => [styles.phrase, pressed && styles.pressed]}
          onPress={() => onSelect(phraseId)}
        >
          <Text style={styles.label}>{t(`phrases.${phraseId}`)}</Text>
        </Pressable>
      ))}
    </View>
  );
};
