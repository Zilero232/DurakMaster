import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { TEST_ID } from '@/shared/config';
import { useLayout } from '@/shared/model/layout';
import { Button } from '@/ui-kit';

import type { CreateTableProps } from './CreateTable.types';

import { useCreateTableForm } from '../model';
import { CommonSettings, DurakDeckSection, DurakModesSection, PrivacySection } from './components';
import { styles } from './CreateTable.styles';

export const CreateTable = ({ isPending = false, onCreate }: CreateTableProps) => {
  const { t } = useTranslation();

  const { isDesktop } = useLayout();

  const { control, game, deckSize, isPrivate, canSubmit, submit } = useCreateTableForm({
    onCreate
  });

  const table = (
    <>
      <CommonSettings control={control} deckSize={deckSize} game={game} />
      <DurakDeckSection control={control} />
    </>
  );

  const rules = (
    <>
      <DurakModesSection control={control} />
      <PrivacySection control={control} isPrivate={isPrivate} />

      <Button
        isFullWidth
        isDisabled={!canSubmit}
        isLoading={isPending}
        size='lg'
        testID={TEST_ID.lobby.createSubmit}
        variant='primary'
        onPress={submit}
      >
        {t('create.submit')}
      </Button>
    </>
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.root, isDesktop && styles.columns]}
      showsVerticalScrollIndicator={false}
    >
      {isDesktop ? (
        <>
          <View style={styles.column}>{table}</View>
          <View style={styles.column}>{rules}</View>
        </>
      ) : (
        <>
          {table}
          {rules}
        </>
      )}
    </ScrollView>
  );
};
