import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useReadyPrompt } from '@/entities/game-table';
import { ARE_BOTS_ENABLED, TEST_ID } from '@/shared/config';
import { Button } from '@/ui-kit';

import { useTableContext } from '../../../../../model';
import { styles } from '../../TableActions.styles';

export const MoveButton = () => {
  const { t } = useTranslation();

  const { turn, moves } = useTableContext();

  useReadyPrompt({
    isWaiting: turn.isWaiting,
    isReady: turn.isReady,
    hasFreeSeat: turn.hasFreeSeat
  });

  if (turn.isWaiting) {
    return (
      <View style={styles.actionSlot}>
        <Button
          style={styles.action}
          testID={TEST_ID.table.ready}
          variant={turn.isReady ? 'ghost' : 'primary'}
          onPress={() => {
            moves.onReady(!turn.isReady);
          }}
        >
          {t(turn.isReady ? 'table.notReady' : 'table.ready')}
        </Button>

        {ARE_BOTS_ENABLED && turn.hasFreeSeat && (
          <Button
            style={styles.action}
            testID={TEST_ID.table.addBot}
            variant='ghost'
            onPress={moves.onAddBot}
          >
            {t('table.addBot')}
          </Button>
        )}
      </View>
    );
  }

  return (
    <View style={styles.actionSlot}>
      {turn.canTake && (
        <Button
          style={styles.action}
          testID={TEST_ID.table.take}
          variant='danger'
          onPress={moves.onTake}
        >
          {t('table.take')}
        </Button>
      )}

      {turn.canPass && (
        <Button
          style={styles.action}
          testID={TEST_ID.table.pass}
          variant='primary'
          onPress={moves.onPass}
        >
          {t('table.pass')}
        </Button>
      )}
    </View>
  );
};
