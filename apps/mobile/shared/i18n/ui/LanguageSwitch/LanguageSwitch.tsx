import { Pressable, Text, View } from 'react-native';

import { LOCALE_LABELS, LOCALES } from '../../config';
import { useLocale } from '../../model';
import { styles } from './LanguageSwitch.styles';

export const LanguageSwitch = () => {
  const { locale, setLocale } = useLocale();

  return (
    <View style={styles.root}>
      {LOCALES.map((value) => {
        const isActive = value === locale;

        return (
          <Pressable
            key={value}
            accessibilityRole='radio'
            accessibilityState={{ selected: isActive }}
            style={[styles.option, isActive && styles.optionActive]}
            onPress={() => setLocale(value)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {LOCALE_LABELS[value]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
