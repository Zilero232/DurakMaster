import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeaveCorner, PlayerHand, TableBar, TrickField, TrickSeats } from '@/entities/game-table';
import { useTysyachaGame } from '@/entities/session';
import { useTableLook } from '@/entities/settings';
import { ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { TysyachaTableProps } from './TysyachaTable.types';

import { StagePanel } from './components';
import { styles } from './TysyachaTable.styles';

export const TysyachaTable = ({ settings, onLeave }: TysyachaTableProps) => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { cardScale, handSort, showHints, isInstant } = useTableLook();

  const game = useTysyachaGame();
  const { view } = game;

  const stagePanel = (
    <StagePanel
      contract={game.contract}
      isDeclarer={game.isDeclarer}
      isMyTurn={game.isMyTurn}
      nextBid={game.nextBid}
      stage={game.stage}
      onBid={game.bid}
      onPass={game.pass}
    />
  );

  return (
    <FeltBackground style={styles.root}>
      <ContentWidth
        maxWidth={TABLE_MAX_WIDTH}
        style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <LeaveCorner onLeave={onLeave} />

        <TrickSeats
          activeSeat={view?.activeSeat ?? -1}
          isDealt={game.stage === 'playing'}
          leadSeat={view?.leadSeat ?? 0}
          mySeat={game.mySeat}
          players={game.seats}
          profiles={game.players}
          readyUserIds={game.readyUserIds}
          turnDeadline={view?.turnDeadline ?? null}
          turnSeconds={settings.turnTimeoutSeconds}
        />

        {game.stage === 'playing' ? (
          <TrickField
            plays={(view?.trick ?? []).map((entry) => ({
              seat: entry.seat,
              cards: [entry.card]
            }))}
            cardScale={cardScale}
            isInstant={isInstant}
            mySeat={game.mySeat}
          />
        ) : (
          <View style={styles.stageArea}>{stagePanel}</View>
        )}

        <View style={styles.score}>
          <Text style={styles.scoreLabel}>{t('games.tysyacha.yourScore')}</Text>
          <Text style={styles.scoreValue}>{game.myPoints}</Text>
        </View>

        <View style={styles.footer}>
          <PlayerHand
            cards={view?.hand ?? []}
            cardScale={cardScale}
            hasHints={showHints}
            isInstant={isInstant}
            playableKeys={game.playableKeys}
            sortMode={handSort}
            trump={view?.trump ?? null}
            onSelect={game.playCard}
          />

          <TableBar
            hasFreeSeat={game.hasFreeSeat}
            isMyTurn={game.isMyTurn}
            isReady={game.isReady}
            isWaiting={game.isWaiting}
            profile={game.profile}
            turnDeadline={view?.turnDeadline ?? null}
            turnSeconds={settings.turnTimeoutSeconds}
            onAddBot={game.addBot}
            onOpenEmojis={() => undefined}
            onReady={game.setReady}
          />
        </View>
      </ContentWidth>
    </FeltBackground>
  );
};
