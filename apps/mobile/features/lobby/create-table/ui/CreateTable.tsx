import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { Button } from '@/ui-kit';

import type { CreateTableFormValues } from '../model';
import type { CreateTableProps } from './CreateTable.types';

import { CREATE_TABLE_DEFAULTS, createTableFormSchema, toTableSettings } from '../model';
import { BetPicker, ModesGrid, OptionRow, PrivacySection, SettingsSection } from './components';
import { DECK_SIZE_ITEMS, PLAYER_COUNT_ITEMS, SPEED_ITEMS } from './CreateTable.config';
import { styles } from './CreateTable.styles';

export const CreateTable = ({ onCreate }: CreateTableProps) => {
  const { t } = useTranslation();

  const { control, handleSubmit, formState } = useForm<CreateTableFormValues>({
    resolver: zodResolver(createTableFormSchema),
    defaultValues: CREATE_TABLE_DEFAULTS,
    mode: 'onChange'
  });

  const isPrivate = useWatch({ control, name: 'isPrivate' });

  const handleCreate = handleSubmit((values) => {
    const password = values.password.trim();

    onCreate(toTableSettings(values), values.isPrivate ? password : undefined);
  });

  return (
    <ScrollView contentContainerStyle={styles.root} showsVerticalScrollIndicator={false}>
      <Controller
        control={control}
        name='bet'
        render={({ field }) => <BetPicker value={field.value} onChange={field.onChange} />}
      />

      <SettingsSection title={t('create.players')}>
        <Controller
          render={({ field }) => (
            <OptionRow items={PLAYER_COUNT_ITEMS} value={field.value} onChange={field.onChange} />
          )}
          control={control}
          name='maxPlayers'
        />
      </SettingsSection>

      <View style={styles.row}>
        <SettingsSection isInRow title={t('create.deck')}>
          <Controller
            render={({ field }) => (
              <OptionRow items={DECK_SIZE_ITEMS} value={field.value} onChange={field.onChange} />
            )}
            control={control}
            name='deckSize'
          />
        </SettingsSection>

        <SettingsSection isInRow title={t('create.speed')}>
          <Controller
            render={({ field }) => (
              <OptionRow
                items={SPEED_ITEMS.map((item) => ({ ...item, label: t(item.labelKey) }))}
                value={field.value}
                onChange={field.onChange}
              />
            )}
            control={control}
            name='speed'
          />
        </SettingsSection>
      </View>

      <SettingsSection title={t('create.modes')}>
        <ModesGrid control={control} />
      </SettingsSection>

      <PrivacySection control={control} isPrivate={isPrivate} />

      <Button
        isFullWidth
        isDisabled={!formState.isValid}
        size='lg'
        variant='primary'
        onPress={handleCreate}
      >
        {t('create.submit')}
      </Button>
    </ScrollView>
  );
};
