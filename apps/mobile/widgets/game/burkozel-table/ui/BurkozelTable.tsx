import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { TrickPlay } from '@/entities/game-table';

import { LeaveCorner, PlayerHand, TrickField, TrickSeats } from '@/entities/game-table';
import { useBurkozelGame } from '@/entities/session';
import { useTableLook } from '@/entities/settings';
import { useLayout } from '@/shared/model/layout';
import { Button, ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { BurkozelTableProps } from './BurkozelTable.types';

import { styles } from './BurkozelTable.styles';
import { ScoreBar } from './components';

export const BurkozelTable = ({ settings, onLeave }: BurkozelTableProps) => {
  const game = useBurkozelGame();
  const { view } = game;
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const { isWide } = useLayout();
  const { cardScale, handSort, showHints, isInstant } = useTableLook();

  if (!view) {
    return null;
  }

  const plays = view.trick.map<TrickPlay>((play) => ({
    seat: play.seat,
    cards: play.cards ?? Array.from<null>({ length: play.cardCount }).fill(null)
  }));

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
          bestIndex={view.bestPlayIndex}
          cardScale={cardScale}
          isInstant={isInstant}
          mySeat={game.mySeat}
          plays={plays}
        />

        <ScoreBar points={view.myPoints} talonCount={view.talonCount} />

        <View style={styles.footer}>
          <PlayerHand
            cards={view.hand}
            cardScale={cardScale}
            hasHints={showHints}
            isInstant={isInstant}
            playableKeys={game.playableKeys}
            selectedKeys={game.selectedKeys}
            sortMode={handSort}
            trump={view.trump}
            onSelect={game.toggleCard}
          />

          <Button
            isDisabled={!game.canPlay}
            size='lg'
            style={styles.action}
            variant='primary'
            onPress={game.playSelected}
          >
            {t('games.burkozel.playCards', { total: game.selectedKeys.size })}
          </Button>
        </View>
      </ContentWidth>
    </FeltBackground>
  );
};
