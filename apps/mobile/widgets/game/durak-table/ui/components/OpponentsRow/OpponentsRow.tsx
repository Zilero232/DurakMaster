import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { OpponentSeat } from '@/entities/game-table';
import { useSettingsStore } from '@/entities/settings';
import { useLayout } from '@/shared/model/layout';

import type { OpponentsRowProps } from './OpponentsRow.types';

import { ARC_LIFT } from './OpponentsRow.config';
import { styles } from './OpponentsRow.styles';

export const OpponentsRow = ({
  view,
  players,
  readyUserIds,
  mySeat,
  phrases,
  turnSeconds,
  loserUserId = null,
  onSelectPlayer
}: OpponentsRowProps) => {
  const { t } = useTranslation();

  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);

  const { isDesktop } = useLayout();

  const opponents = view.players.filter((player) => player.seat !== mySeat);

  const isDealt = view.phase === 'playing';

  const arcLift = (index: number, total: number): number => {
    if (total < 3) {
      return 0;
    }

    const middle = (total - 1) / 2;

    return Math.round((1 - Math.abs(index - middle) / middle) * ARC_LIFT);
  };

  return (
    <View style={[styles.root, isDesktop && styles.withLeaveButton]}>
      {opponents.map((player, index) => {
        const meta = players.find((item) => item.userId === player.userId);
        const isEmpty = !meta;

        return (
          <OpponentSeat
            key={player.userId}
            arcLift={arcLift(index, opponents.length)}
            avatarUrl={meta?.avatarUrl ?? null}
            isActive={player.seat === view.activeSeat}
            isAttacker={isDealt && player.seat === view.attackerSeat}
            isDefender={isDealt && player.seat === view.defenderSeat}
            isEmpty={isEmpty}
            isLoser={player.userId === loserUserId}
            isReady={readyUserIds.has(player.userId)}
            isStatic={isBatterySaver}
            name={meta?.name ?? t('table.seatFree')}
            phrase={phrases[player.userId]}
            player={player}
            seatCount={opponents.length}
            turnDeadline={view.turnDeadline}
            turnSeconds={turnSeconds}
            onPress={() => onSelectPlayer?.(player.userId)}
          />
        );
      })}
    </View>
  );
};
