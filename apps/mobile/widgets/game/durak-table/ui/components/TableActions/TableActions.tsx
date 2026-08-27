import { useBoolean } from '@siberiacancode/reactuse';
import { View } from 'react-native';

import { WalletChip } from '@/entities/game-table';
import { TableEmojis } from '@/features/game/table-emojis';

import type { TableActionsProps } from './TableActions.types';

import { useTableContext } from '../../../model';
import { BoostBar, MoveButton, SeatButton } from './components';
import { styles } from './TableActions.styles';

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

        {/* Boosts act on a hand in play, so they have nothing to do while seats fill up. */}
        {!turn.isWaiting && <BoostBar coins={profile?.coins ?? 0} onUseBoost={moves.onUseBoost} />}

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
