import { Bot, Check, Hand, ShieldCheck, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useReadyPrompt } from '@/entities/game-table';
import { ARE_BOTS_ENABLED } from '@/shared/config';
import { Button, iconSize } from '@/ui-kit';

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
          icon={(color) =>
            turn.isReady ? (
              <X color={color} size={iconSize.md} />
            ) : (
              <Check color={color} size={iconSize.md} />
            )
          }
          style={styles.action}
          variant={turn.isReady ? 'ghost' : 'primary'}
          onPress={() => {
            moves.onReady(!turn.isReady);
          }}
        >
          {t(turn.isReady ? 'table.notReady' : 'table.ready')}
        </Button>

        {ARE_BOTS_ENABLED && turn.hasFreeSeat && (
          <Button
            icon={(color) => <Bot color={color} size={iconSize.md} />}
            style={styles.action}
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
          icon={(color) => <Hand color={color} size={iconSize.md} />}
          style={styles.action}
          variant='danger'
          onPress={moves.onTake}
        >
          {t('table.take')}
        </Button>
      )}

      {turn.canPass && (
        <Button
          icon={(color) => <ShieldCheck color={color} size={iconSize.md} />}
          style={styles.action}
          variant='primary'
          onPress={moves.onPass}
        >
          {t('table.pass')}
        </Button>
      )}
    </View>
  );
};
