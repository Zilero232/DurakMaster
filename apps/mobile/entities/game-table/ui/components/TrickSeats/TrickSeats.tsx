import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { TrickSeatsProps } from './TrickSeats.types';

import { OpponentSeat } from '../OpponentSeat';

export const TrickSeats = ({
  players,
  profiles,
  mySeat,
  activeSeat,
  leadSeat,
  turnDeadline = null,
  turnSeconds = 0
}: TrickSeatsProps) => {
  const { t } = useTranslation();

  return (
    <View>
      {players
        .filter((player) => player.seat !== mySeat)
        .map((player) => {
          const meta = profiles.find((item) => item.userId === player.userId);

          return (
            <OpponentSeat
              key={player.userId}
              avatarUrl={meta?.avatarUrl ?? null}
              isActive={player.seat === activeSeat}
              isAttacker={player.seat === leadSeat}
              isDefender={false}
              name={meta?.name ?? t('table.playerFallback', { seat: player.seat + 1 })}
              player={player}
              turnDeadline={turnDeadline}
              turnSeconds={turnSeconds}
            />
          );
        })}
    </View>
  );
};
