import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { OpponentSeat } from '@/entities/game-table';
import { useSettingsStore } from '@/entities/settings';

import type { OpponentsRowProps } from './OpponentsRow.types';

import { useRowWidth } from '../../../model';
import { styles } from './OpponentsRow.styles';

export const OpponentsRow = ({
  view,
  players,
  readyUserIds,
  mySeat,
  phrases,
  turnSeconds,
  isWaiting,
  onSelectPlayer
}: OpponentsRowProps) => {
  const { t } = useTranslation();

  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);

  const row = useRowWidth();

  const opponents = view.players.filter((player) => player.seat !== mySeat);

  const isDealt = view.phase === 'playing';
  const emptySeatName = t(isWaiting ? 'table.inviteFriends' : 'table.seatFree');

  return (
    <View style={styles.root}>
      <View style={styles.seats} onLayout={row.measure}>
        {opponents.map((player) => {
          const meta = players.find((item) => item.userId === player.userId);
          const isEmpty = !meta;
          const isTappable = !isEmpty || isWaiting;

          return (
            <OpponentSeat
              key={player.userId}
              avatarUrl={meta?.avatarUrl ?? null}
              isActive={player.seat === view.activeSeat}
              isAttacker={isDealt && player.seat === view.attackerSeat}
              isDefender={isDealt && player.seat === view.defenderSeat}
              isEmpty={isEmpty}
              isReady={readyUserIds.has(player.userId)}
              isStatic={isBatterySaver}
              name={meta?.name ?? emptySeatName}
              phrase={phrases[player.userId]}
              player={player}
              rowWidth={row.width}
              seatCount={opponents.length}
              turnDeadline={view.turnDeadline}
              turnSeconds={turnSeconds}
              onPress={isTappable ? () => onSelectPlayer(player.userId) : undefined}
            />
          );
        })}
      </View>
    </View>
  );
};
