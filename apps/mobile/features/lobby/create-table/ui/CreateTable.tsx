import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { useLayout } from '@/shared/model/layout';
import { Button } from '@/ui-kit';

import type { CreateTableProps } from './CreateTable.types';

import { useCreateTableForm } from '../model';
import { CommonSettings, DurakSettings, PrivacySection } from './components';
import { styles } from './CreateTable.styles';

export const CreateTable = ({ onCreate }: CreateTableProps) => {
  const { t } = useTranslation();

  const { isDesktop } = useLayout();

  const { control, game, deckSize, isPrivate, canSubmit, submit } = useCreateTableForm({
    onCreate
  });

  const common = <CommonSettings control={control} deckSize={deckSize} game={game} />;

  const gameSettings = <DurakSettings control={control} />;

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
          <View style={styles.column}>{common}</View>

          <View style={styles.column}>
            {gameSettings}
            {privacy}
            {submitButton}
          </View>
        </>
      ) : (
        <>
          {common}
          {gameSettings}
          {privacy}
          {submitButton}
        </>
      )}
    </ScrollView>
  );
};
