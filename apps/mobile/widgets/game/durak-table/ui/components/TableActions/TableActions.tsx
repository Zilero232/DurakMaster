import type { BoostId } from '@durak-master/schemas';

import { useBoolean } from '@siberiacancode/reactuse';
import { View } from 'react-native';

import { BoostBar, WalletChip } from '@/entities/game-table';
import { TableEmojis } from '@/features/game/table-emojis';

import type { TableActionsProps } from './TableActions.types';

import { useTableContext } from '../../../model';
import { MoveButton, SeatButton } from './components';
import { styles } from './TableActions.styles';

const UNDO_BLOCKED = new Set<BoostId>(['undoMove']);

export const TableActions = ({ turnDeadline }: TableActionsProps) => {
  const { profile, chatter, turn, moves } = useTableContext();

  const [isEmojisOpen, toggleEmojis] = useBoolean(false);

  return (
    <View style={styles.wrap}>
      {profile && (
        <View style={styles.walletRow}>
          <WalletChip coins={profile.coins} credits={profile.credits} />
        </View>
      )}

      <View style={styles.root}>
        <MoveButton />

        <SeatButton
          chatter={chatter}
          isLoser={turn.isLoser}
          isMyTurn={turn.isMyTurn}
          profile={profile}
          turnDeadline={turnDeadline}
          turnSeconds={turn.turnSeconds}
          onPress={() => toggleEmojis(true)}
        />

        <View style={styles.boosts}>
          {!turn.isWaiting && (
            <BoostBar
              coins={profile?.coins ?? 0}
              unavailable={turn.canUndo ? undefined : UNDO_BLOCKED}
              onUseBoost={moves.onUseBoost}
            />
          )}
        </View>

        <TableEmojis
          isOpen={isEmojisOpen}
          onClose={() => toggleEmojis(false)}
          onSendEmoji={moves.onSendEmoji}
          onSendPhrase={moves.onSendPhrase}
        />
      </View>
    </View>
  );
};
