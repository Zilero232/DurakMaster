import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { TrickSeatsProps } from './TrickSeats.types';

import { OpponentSeat } from '../OpponentSeat';
import { styles } from './TrickSeats.styles';

export const TrickSeats = ({
  players,
  profiles,
  readyUserIds,
  mySeat,
  activeSeat,
  leadSeat,
  isDealt = false,
  turnDeadline = null,
  turnSeconds = 0
}: TrickSeatsProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      {players
        .filter((player) => player.seat !== mySeat)
        .map((player) => {
          const meta = profiles.find((item) => item.userId === player.userId);
          const isEmpty = !meta;

          return (
            <OpponentSeat
              key={player.userId}
              avatarUrl={meta?.avatarUrl ?? null}
              isActive={player.seat === activeSeat}
              isAttacker={isDealt && player.seat === leadSeat}
              isDefender={false}
              isEmpty={isEmpty}
              isReady={readyUserIds?.has(player.userId) ?? false}
              name={meta?.name ?? t('table.emptySeat')}
              player={player}
              turnDeadline={turnDeadline}
              turnSeconds={turnSeconds}
            />
          );
        })}
    </View>
  );
};
