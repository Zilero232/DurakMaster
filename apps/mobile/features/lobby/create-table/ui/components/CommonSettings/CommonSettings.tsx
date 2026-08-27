import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CommonSettingsProps } from './CommonSettings.types';

import { playerCountItems, SPEED_ITEMS } from '../../CreateTable.config';
import { BetPicker } from '../BetPicker';
import { OptionRow } from '../OptionRow';
import { SettingsSection } from '../SettingsSection';

export const CommonSettings = ({ control, game }: CommonSettingsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Controller
        control={control}
        name='bet'
        render={({ field }) => <BetPicker value={field.value} onChange={field.onChange} />}
      />

      <SettingsSection title={t('create.players')}>
        <Controller
          render={({ field }) => (
            <OptionRow
              items={playerCountItems(game)}
              value={field.value}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='maxPlayers'
        />
      </SettingsSection>

      <SettingsSection title={t('create.speed')}>
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
    </>
  );
};
