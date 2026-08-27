import { Gamepad2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text } from 'react-native';

import { Button } from '@/ui-kit';

import type { CreateTableProps } from './CreateTable.types';

import { useCreateTableForm } from '../model';
import {
  CommonSettings,
  GamePicker,
  GameSettings,
  PrivacySection,
  SettingsSection
} from './components';
import { styles } from './CreateTable.styles';

export const CreateTable = ({ onCreate }: CreateTableProps) => {
  const { t } = useTranslation();

  const { control, game, isPrivate, isAvailable, canSubmit, selectGame, submit } =
    useCreateTableForm({ onCreate });

  return (
    <ScrollView contentContainerStyle={styles.root} showsVerticalScrollIndicator={false}>
      <SettingsSection icon={Gamepad2} title={t('games.pick')}>
        <GamePicker value={game} onChange={selectGame} />
      </SettingsSection>

      {!isAvailable && <Text style={styles.notice}>{t('games.comingSoonHint')}</Text>}

      <CommonSettings control={control} game={game} />

      <GameSettings control={control} game={game} />

      <PrivacySection control={control} isPrivate={isPrivate} />

      <Button isFullWidth isDisabled={!canSubmit} size='lg' variant='primary' onPress={submit}>
        {t('create.submit')}
      </Button>
    </ScrollView>
  );
};
