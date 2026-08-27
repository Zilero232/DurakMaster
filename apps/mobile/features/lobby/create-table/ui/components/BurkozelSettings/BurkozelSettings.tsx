import { Settings2, TriangleAlert } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { BurkozelSettingsProps } from './BurkozelSettings.types';

import { ModesGrid } from '../ModesGrid';
import { OptionRow } from '../OptionRow';
import { SettingsSection } from '../SettingsSection';
import {
  BURKOZEL_CHOICE_FIELDS,
  BURKOZEL_TOGGLE_FIELDS,
  PENALTY_LIMIT_ITEMS
} from './BurkozelSettings.config';

export const BurkozelSettings = ({ control }: BurkozelSettingsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <SettingsSection icon={TriangleAlert} title={t('games.burkozel.penaltyLimit')}>
        <Controller
          render={({ field }) => (
            <OptionRow items={PENALTY_LIMIT_ITEMS} value={field.value} onChange={field.onChange} />
          )}
          control={control}
          name='burkozelRules.penaltyLimit'
        />
      </SettingsSection>

      <SettingsSection icon={Settings2} title={t('create.modes')}>
        <ModesGrid
          choices={BURKOZEL_CHOICE_FIELDS}
          control={control}
          toggles={BURKOZEL_TOGGLE_FIELDS}
        />
      </SettingsSection>
    </>
  );
};
