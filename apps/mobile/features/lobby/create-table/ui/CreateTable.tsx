import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Button } from '@/ui-kit';

import type { CreateTableProps } from './CreateTable.types';

import { useCreateTableForm } from '../model';
import { CommonSettings, MoreRules } from './components';
import { KEYBOARD_BOTTOM_OFFSET } from './CreateTable.config';
import { styles } from './CreateTable.styles';

export const CreateTable = ({ isPending, onCreate }: CreateTableProps) => {
  const { t } = useTranslation();

  const { control, game, durakRules, isPrivate, canSubmit, submit } = useCreateTableForm({
    onCreate
  });

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        bottomOffset={KEYBOARD_BOTTOM_OFFSET}
        contentContainerStyle={styles.content}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <CommonSettings control={control} deckSize={durakRules.deckSize} game={game} />

        <MoreRules control={control} isPrivate={isPrivate} rules={durakRules} />
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
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
      </View>
    </View>
  );
};
