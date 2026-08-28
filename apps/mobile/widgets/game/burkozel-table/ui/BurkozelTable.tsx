import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { TrickPlay } from '@/entities/game-table';

import { LeaveCorner, PlayerHand, TableBar, TrickField, TrickSeats } from '@/entities/game-table';
import { useBurkozelGame } from '@/entities/session';
import { useTableLook } from '@/entities/settings';
import { Button, ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { BurkozelTableProps } from './BurkozelTable.types';

import { styles } from './BurkozelTable.styles';
import { ScoreBar } from './components';

export const BurkozelTable = ({ settings, onLeave }: BurkozelTableProps) => {
  const game = useBurkozelGame();
  const { view } = game;
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { cardScale, handSort, showHints, isInstant } = useTableLook();

  const plays = (view?.trick ?? []).map<TrickPlay>((play) => ({
    seat: play.seat,
    cards: play.cards ?? Array.from<null>({ length: play.cardCount }).fill(null)
  }));

  return (
    <FeltBackground style={styles.root}>
      <ContentWidth
        maxWidth={TABLE_MAX_WIDTH}
        style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <LeaveCorner onLeave={onLeave} />

        <TrickSeats
          activeSeat={view?.activeSeat ?? -1}
          isDealt={view?.phase === 'playing'}
          leadSeat={view?.leadSeat ?? 0}
          mySeat={game.mySeat}
          players={game.seats}
          profiles={game.players}
          readyUserIds={game.readyUserIds}
          turnDeadline={view?.turnDeadline ?? null}
          turnSeconds={settings.turnTimeoutSeconds}
        />

        <TrickField
          bestIndex={view?.bestPlayIndex ?? null}
          cardScale={cardScale}
          isInstant={isInstant}
          mySeat={game.mySeat}
          plays={plays}
        />

        <ScoreBar points={view?.myPoints ?? 0} talonCount={view?.talonCount ?? 0} />

        <View style={styles.footer}>
          <PlayerHand
            cards={view?.hand ?? []}
            cardScale={cardScale}
            hasHints={showHints}
            isInstant={isInstant}
            playableKeys={game.playableKeys}
            selectedKeys={game.selectedKeys}
            sortMode={handSort}
            trump={view?.trump ?? null}
            onSelect={game.toggleCard}
          />

          <TableBar
            actions={
              <Button
                isDisabled={!game.canPlay}
                style={styles.action}
                variant='primary'
                onPress={game.playSelected}
              >
                {t('games.burkozel.playCards', { total: game.selectedKeys.size })}
              </Button>
            }
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
