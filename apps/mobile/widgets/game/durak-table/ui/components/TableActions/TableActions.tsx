import { useBoolean } from '@siberiacancode/reactuse';
import { View } from 'react-native';

import { BoostBar } from '@/entities/game-table';
import { TableEmojis } from '@/features/game/table-emojis';

import type { TableActionsProps } from './TableActions.types';

import { useBoostConfirm, useTableContext } from '../../../model';
import { BoostConfirm, MySeat, PrimaryActionButton, WaitingActions } from './components';
import { UNDO_BLOCKED } from './TableActions.config';
import { styles } from './TableActions.styles';

export const TableActions = ({ turnDeadline }: TableActionsProps) => {
  const { profile, chatter, turn, moves } = useTableContext();

  const [isEmojisOpen, toggleEmojis] = useBoolean(false);

  const coins = profile?.coins ?? 0;

  const boost = useBoostConfirm({ coins, canUndo: turn.canUndo, onUseBoost: moves.onUseBoost });

  return (
    <View style={styles.root}>
      <View style={styles.extras}>
        {turn.isWaiting ? (
          <WaitingActions />
        ) : (
          <BoostBar
            boosts={turn.boosts}
            coins={coins}
            unavailable={turn.canUndo ? undefined : UNDO_BLOCKED}
            onSelectBoost={boost.select}
          />
        )}
      </View>

      <View style={styles.bar}>
        <MySeat
          chatter={chatter}
          isMyTurn={turn.isMyTurn}
          profile={profile}
          turnDeadline={turnDeadline}
          turnSeconds={turn.turnSeconds}
          onOpenEmojis={() => toggleEmojis(true)}
        />

        <PrimaryActionButton />
      </View>

      <TableEmojis
        isOpen={isEmojisOpen}
        onClose={() => toggleEmojis(false)}
        onSendEmoji={moves.onSendEmoji}
        onSendPhrase={moves.onSendPhrase}
      />

      {boost.boost !== null && (
        <BoostConfirm
          blocker={boost.blocker}
          boost={boost.boost}
          coins={coins}
          isOpen={boost.isOpen}
          onCancel={boost.cancel}
          onConfirm={boost.confirm}
        />
      )}
    </View>
  );
};
