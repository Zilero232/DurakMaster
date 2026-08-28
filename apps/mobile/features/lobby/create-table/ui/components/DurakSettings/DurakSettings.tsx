import { Layers, Settings2 } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { DurakSettingsProps } from './DurakSettings.types';

import { ModesGrid } from '../ModesGrid';
import { OptionRow } from '../OptionRow';
import { SettingsSection } from '../SettingsSection';
import { DURAK_CHOICE_FIELDS, DURAK_TOGGLE_FIELDS } from './DurakModes.config';
import { DECK_SIZE_ITEMS } from './DurakSettings.config';

export const DurakSettings = ({ control }: DurakSettingsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <SettingsSection hint={t('games.durak.deckHint')} icon={Layers} title={t('games.durak.deck')}>
        <Controller
          render={({ field }) => (
            <OptionRow items={DECK_SIZE_ITEMS} value={field.value} onChange={field.onChange} />
          )}
          control={control}
          name='durakRules.deckSize'
        />
      </SettingsSection>

      <SettingsSection icon={Settings2} title={t('create.modes')}>
        <ModesGrid choices={DURAK_CHOICE_FIELDS} control={control} toggles={DURAK_TOGGLE_FIELDS} />
      </SettingsSection>
    </>
  );
};
