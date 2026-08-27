import { useBoolean } from '@siberiacancode/reactuse';
import { View } from 'react-native';

import { WalletChip } from '@/entities/game-table';
import { TableEmojis } from '@/features/game/table-emojis';
import { useLayout } from '@/shared/model/layout';

import type { TableActionsProps } from './TableActions.types';

import { BoostBar, MoveButton, SeatButton } from './components';
import { styles } from './TableActions.styles';

export const TableActions = ({
  profile,
  chatter,
  isMyTurn,
  turnDeadline,
  turnSeconds,
  canTake,
  canPass,
  onSendEmoji,
  onSendPhrase,
  onUseBoost,
  onTake,
  onPass,
  onLeave
}: TableActionsProps) => {
  const { isWide } = useLayout();

  const [isEmojisOpen, toggleEmojis] = useBoolean(false);

  return (
    <View style={styles.wrap}>
      {profile && (
        <View style={styles.walletRow}>
          <WalletChip coins={profile.coins} credits={profile.credits} />
        </View>
      )}

      <View style={styles.root}>
        <MoveButton canPass={canPass} canTake={canTake} onPass={onPass} onTake={onTake} />

        <SeatButton
          chatter={chatter}
          isMyTurn={isMyTurn}
          profile={profile}
          turnDeadline={turnDeadline}
          turnSeconds={turnSeconds}
          onPress={() => toggleEmojis(true)}
        />

        <BoostBar
          coins={profile?.coins ?? 0}
          hasLeaveButton={isWide}
          onLeave={onLeave}
          onUseBoost={onUseBoost}
        />

        <TableEmojis
          isOpen={isEmojisOpen}
          onClose={() => toggleEmojis(false)}
          onSendEmoji={onSendEmoji}
          onSendPhrase={onSendPhrase}
        />
      </View>
    </View>
  );
};
