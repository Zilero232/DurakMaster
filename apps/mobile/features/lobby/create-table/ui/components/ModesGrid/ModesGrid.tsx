import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { ModesGridProps } from './ModesGrid.types';

import { ModeCard } from '../ModeCard';
import { styles } from './ModesGrid.styles';

export const ModesGrid = ({ control, choices = [], toggles = [] }: ModesGridProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      {choices.map((field) => (
        <Controller
          key={field.name}
          render={({ field: { value, onChange } }) => (
            <>
              {field.options.map((option) => (
                <ModeCard
                  key={String(option.value)}
                  hint={option.hintKey && t(option.hintKey)}
                  icon={option.icon}
                  isActive={value === option.value}
                  label={t(option.labelKey)}
                  onPress={() => onChange(option.value)}
                />
              ))}
            </>
          )}
          control={control}
          name={field.name}
        />
      ))}

      {toggles.map((field) => (
        <Controller
          key={field.name}
          render={({ field: { value, onChange } }) => (
            <ModeCard
              hint={field.hintKey && t(field.hintKey)}
              icon={field.icon}
              isActive={Boolean(value)}
              label={t(field.labelKey)}
              onPress={() => onChange(!value)}
            />
          )}
          control={control}
          name={field.name}
        />
      ))}
    </View>
  );
};
