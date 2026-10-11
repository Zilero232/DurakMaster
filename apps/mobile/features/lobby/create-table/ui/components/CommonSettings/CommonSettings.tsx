import { Timer, Users } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { SettingsSection } from '@/ui-kit';

import type { CommonSettingsProps } from './CommonSettings.types';

import { playerCountItems, SPEED_ITEMS } from '../../CreateTable.config';
import { BetPicker } from '../BetPicker';
import { OptionRow } from '../OptionRow';
import { styles } from './CommonSettings.styles';

export const CommonSettings = ({ control, deckSize, game }: CommonSettingsProps) => {
  const { t } = useTranslation();

  const seatCounts = playerCountItems(game, deckSize);
  const isSeatCountFixed = seatCounts.length === 1;

  return (
    <>
      <Controller
        control={control}
        name='bet'
        render={({ field }) => <BetPicker value={field.value} onChange={field.onChange} />}
      />

      <View style={styles.stack}>
        <SettingsSection
          hint={
            isSeatCountFixed ? t('create.playersFixed', { count: seatCounts[0]?.value }) : undefined
          }
          icon={Users}
          title={t('create.players')}
        >
          {!isSeatCountFixed && (
            <Controller
              render={({ field }) => (
                <OptionRow items={seatCounts} value={field.value} onChange={field.onChange} />
              )}
              control={control}
              name='maxPlayers'
            />
          )}
        </SettingsSection>

        <SettingsSection icon={Timer} title={t('create.speed')}>
          <Controller
            render={({ field }) => (
              <OptionRow
                items={SPEED_ITEMS.map((item) => ({
                  value: item.value,
                  label: t(item.labelKey),
                  hint: t('create.speedHint', { seconds: item.seconds })
                }))}
                value={field.value}
                onChange={field.onChange}
              />
            )}
            control={control}
            name='speed'
          />
        </SettingsSection>
      </View>
    </>
  );
};
