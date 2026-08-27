import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { KozelSettingsProps } from './KozelSettings.types';

import { ModesGrid } from '../ModesGrid';
import { OptionRow } from '../OptionRow';
import { SettingsSection } from '../SettingsSection';
import {
  KOZEL_CHOICE_FIELDS,
  KOZEL_TOGGLE_FIELDS,
  TARGET_PAIRS_ITEMS
} from './KozelSettings.config';

export const KozelSettings = ({ control }: KozelSettingsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <SettingsSection title={t('games.kozel.targetPairs')}>
        <Controller
          render={({ field }) => (
            <OptionRow items={TARGET_PAIRS_ITEMS} value={field.value} onChange={field.onChange} />
          )}
          control={control}
          name='kozelRules.targetPairs'
        />
      </SettingsSection>

      <SettingsSection title={t('create.modes')}>
        <ModesGrid choices={KOZEL_CHOICE_FIELDS} control={control} toggles={KOZEL_TOGGLE_FIELDS} />
      </SettingsSection>
    </>
  );
};
