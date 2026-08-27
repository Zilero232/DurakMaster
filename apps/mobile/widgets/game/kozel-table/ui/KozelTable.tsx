import { isKozelTrump } from '@durak-master/game-core';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeaveCorner, PlayerHand, TrickField, TrickSeats } from '@/entities/game-table';
import { useKozelGame } from '@/entities/session';
import { useTableLook } from '@/entities/settings';
import { useLayout } from '@/shared/model/layout';
import { ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { KozelTableProps } from './KozelTable.types';

import { styles } from './KozelTable.styles';

export const KozelTable = ({ settings, onLeave }: KozelTableProps) => {
  const game = useKozelGame();
  const { view } = game;
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { isWide } = useLayout();
  const { cardScale, handSort, showHints, isInstant } = useTableLook();

  if (!view) {
    return null;
  }

  return (
    <FeltBackground style={styles.root}>
      <ContentWidth
        maxWidth={TABLE_MAX_WIDTH}
        style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        {isWide && <LeaveCorner onLeave={onLeave} />}

        <TrickSeats
          activeSeat={view.activeSeat}
          leadSeat={view.leadSeat}
          mySeat={game.mySeat}
          players={view.players}
          profiles={game.players}
          turnDeadline={view.turnDeadline}
          turnSeconds={settings.turnTimeoutSeconds}
        />

        <TrickField
          cardScale={cardScale}
          isInstant={isInstant}
          mySeat={game.mySeat}
          plays={view.trick.map((entry) => ({ seat: entry.seat, cards: [entry.card] }))}
        />

        <View style={styles.score}>
          <View style={styles.team}>
            <Text style={styles.teamLabel}>{t('games.kozel.yourTeam')}</Text>
            <Text style={[styles.teamValue, styles.mine]}>{view.myTeamPoints}</Text>
          </View>

          <View style={styles.team}>
            <Text style={styles.teamLabel}>{t('games.kozel.opponents')}</Text>
            <Text style={styles.teamValue}>{view.opponentPoints}</Text>
          </View>
        </View>

        <View style={styles.hand}>
          <PlayerHand
            cards={view.hand}
            cardScale={cardScale}
            hasHints={showHints}
            isInstant={isInstant}
            playableKeys={game.playableKeys}
            sortMode={handSort}
            trump={isKozelTrump}
            onSelect={game.playCard}
          />
        </View>
      </ContentWidth>
    </FeltBackground>
  );
};
