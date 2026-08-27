import { Flag, Gavel, Settings2 } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { TysyachaSettingsProps } from './TysyachaSettings.types';

import { ModesGrid } from '../ModesGrid';
import { OptionRow } from '../OptionRow';
import { SettingsSection } from '../SettingsSection';
import {
  BID_STEP_ITEMS,
  TYSYACHA_CHOICE_FIELDS,
  TYSYACHA_TOGGLE_FIELDS,
  WINNING_SCORE_ITEMS
} from './TysyachaSettings.config';

export const TysyachaSettings = ({ control }: TysyachaSettingsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <SettingsSection icon={Flag} title={t('games.tysyacha.winningScore')}>
        <Controller
          render={({ field }) => (
            <OptionRow items={WINNING_SCORE_ITEMS} value={field.value} onChange={field.onChange} />
          )}
          control={control}
          name='tysyachaRules.winningScore'
        />
      </SettingsSection>

      <SettingsSection icon={Gavel} title={t('games.tysyacha.bidStep')}>
        <Controller
          render={({ field }) => (
            <OptionRow items={BID_STEP_ITEMS} value={field.value} onChange={field.onChange} />
          )}
          control={control}
          name='tysyachaRules.bidStep'
        />
      </SettingsSection>

      <SettingsSection icon={Settings2} title={t('create.modes')}>
        <ModesGrid
          choices={TYSYACHA_CHOICE_FIELDS}
          control={control}
          toggles={TYSYACHA_TOGGLE_FIELDS}
        />
      </SettingsSection>
    </>
  );
};
