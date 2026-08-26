import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/ui-kit';

import type { MoveButtonProps } from './MoveButton.types';

import { styles } from '../../TableActions.styles';

export const MoveButton = ({ canTake, canPass, onTake, onPass }: MoveButtonProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.actionSlot}>
      {canTake && (
        <Button style={styles.action} variant='danger' onPress={onTake}>
          {t('table.take')}
        </Button>
      )}

      {canPass && (
        <Button style={styles.action} variant='primary' onPress={onPass}>
          {t('table.pass')}
        </Button>
      )}
    </View>
  );
};
