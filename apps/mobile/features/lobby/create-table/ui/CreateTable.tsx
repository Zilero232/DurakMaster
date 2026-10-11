import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { Button } from '@/ui-kit';

import type { CreateTableProps } from './CreateTable.types';

import { useCreateTableForm } from '../model';
import { CommonSettings, DurakDeckSection, DurakModesSection, PrivacySection } from './components';
import { styles } from './CreateTable.styles';

export const CreateTable = ({ isPending, onCreate }: CreateTableProps) => {
  const { t } = useTranslation();

  const { control, game, deckSize, durakMode, isPrivate, canSubmit, submit } = useCreateTableForm({
    onCreate
  });

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.root}
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
    >
      <CommonSettings control={control} deckSize={deckSize} game={game} />
      <DurakDeckSection control={control} />
      <DurakModesSection control={control} mode={durakMode} />
      <PrivacySection control={control} isPrivate={isPrivate} />

      <Button
        isFullWidth
        isDisabled={!canSubmit}
        isLoading={isPending}
        size='lg'
        variant='primary'
        onPress={submit}
      >
        {t('create.submit')}
      </Button>
    </ScrollView>
  );
};
