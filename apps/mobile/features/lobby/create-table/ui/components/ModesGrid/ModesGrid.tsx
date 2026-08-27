import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Switch, Text, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { ModesGridProps } from './ModesGrid.types';

import { ModeCard } from '../ModeCard';
import { styles } from './ModesGrid.styles';

export const ModesGrid = ({ control, choices = [], toggles = [] }: ModesGridProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      {choices.map((field) => (
        <View key={field.name} style={styles.group}>
          <Text style={styles.groupTitle}>{t(field.titleKey)}</Text>

          <Controller
            render={({ field: { value, onChange } }) => (
              <View style={styles.options}>
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
              </View>
            )}
            control={control}
            name={field.name}
          />
        </View>
      ))}

      {toggles.length > 0 && (
        <View style={styles.toggles}>
          {toggles.map((field) => (
            <Controller
              key={field.name}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  accessibilityRole='switch'
                  accessibilityState={{ checked: Boolean(value) }}
                  style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
                  onPress={() => onChange(!value)}
                >
                  <field.icon
                    color={value ? colors.accent : colors.subtleForeground}
                    size={20}
                    strokeWidth={1.6}
                  />

                  <View style={styles.toggleText}>
                    <Text style={styles.toggleLabel}>{t(field.labelKey)}</Text>

                    {field.hintKey && <Text style={styles.toggleHint}>{t(field.hintKey)}</Text>}
                  </View>

                  <Switch
                    thumbColor={colors.surface1}
                    trackColor={{ false: colors.borderStrong, true: colors.accent }}
                    value={Boolean(value)}
                    onValueChange={onChange}
                  />
                </Pressable>
              )}
              control={control}
              name={field.name}
            />
          ))}
        </View>
      )}
    </View>
  );
};
