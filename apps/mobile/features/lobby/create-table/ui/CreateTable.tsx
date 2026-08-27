import { Gamepad2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useLayout } from '@/shared/model/layout';
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

  const { isDesktop } = useLayout();

  const { control, game, isPrivate, canSubmit, selectGame, submit } = useCreateTableForm({
    onCreate
  });

  const picker = (
    <SettingsSection icon={Gamepad2} title={t('games.pick')}>
      <GamePicker value={game} onChange={selectGame} />
    </SettingsSection>
  );

  const common = <CommonSettings control={control} game={game} />;

  const gameSettings = <GameSettings control={control} game={game} />;

  const privacy = <PrivacySection control={control} isPrivate={isPrivate} />;

  const submitButton = (
    <Button isFullWidth isDisabled={!canSubmit} size='lg' variant='primary' onPress={submit}>
      {t('create.submit')}
    </Button>
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.root, isDesktop && styles.columns]}
      showsVerticalScrollIndicator={false}
    >
      {isDesktop ? (
        <>
          <View style={styles.column}>
            {picker}
            {common}
          </View>

          <View style={styles.column}>
            {gameSettings}
            {privacy}
            {submitButton}
          </View>
        </>
      ) : (
        <>
          {picker}
          {common}
          {gameSettings}
          {privacy}
          {submitButton}
        </>
      )}
    </ScrollView>
  );
};
