import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { OpponentsRowProps } from './OpponentsRow.types';

import { OpponentSeat } from '../../../../game-table/ui/components';
import { styles } from './OpponentsRow.styles';

export const OpponentsRow = ({ view, players, mySeat, phrases }: OpponentsRowProps) => {
  const { t } = useTranslation();

  const opponents = view.players.filter((player) => player.seat !== mySeat);

  return (
    <View style={styles.root}>
      {opponents.map((player) => {
        const meta = players.find((item) => item.userId === player.userId);

        return (
          <OpponentSeat
            key={player.userId}
            avatarUrl={meta?.avatarUrl ?? null}
            isActive={player.seat === view.activeSeat}
            isAttacker={player.seat === view.attackerSeat}
            isDefender={player.seat === view.defenderSeat}
            name={meta?.name ?? t('table.playerFallback', { seat: player.seat + 1 })}
            phrase={phrases[player.userId]}
            player={player}
          />
        );
      })}
    </View>
  );
};
