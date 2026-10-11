import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { OpponentSeat } from '@/entities/game-table';
import { useSettingsStore } from '@/entities/settings';

import type { OpponentsRowProps } from './OpponentsRow.types';

import { arcLift } from '../../../lib';
import { styles } from './OpponentsRow.styles';

export const OpponentsRow = ({
  view,
  players,
  readyUserIds,
  mySeat,
  phrases,
  turnSeconds,
  onSelectPlayer
}: OpponentsRowProps) => {
  const { t } = useTranslation();

  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);

  const opponents = view.players.filter((player) => player.seat !== mySeat);

  const isDealt = view.phase === 'playing';

  return (
    <View style={styles.root}>
      {opponents.map((player, index) => {
        const meta = players.find((item) => item.userId === player.userId);
        const isEmpty = !meta;

        return (
          <OpponentSeat
            key={player.userId}
            arcLift={arcLift({ index, total: opponents.length })}
            avatarUrl={meta?.avatarUrl ?? null}
            isActive={player.seat === view.activeSeat}
            isAttacker={isDealt && player.seat === view.attackerSeat}
            isDefender={isDealt && player.seat === view.defenderSeat}
            isEmpty={isEmpty}
            isReady={readyUserIds.has(player.userId)}
            isStatic={isBatterySaver}
            name={meta?.name ?? t('table.seatFree')}
            phrase={phrases[player.userId]}
            player={player}
            seatCount={opponents.length}
            turnDeadline={view.turnDeadline}
            turnSeconds={turnSeconds}
            onPress={() => onSelectPlayer(player.userId)}
          />
        );
      })}
    </View>
  );
};
