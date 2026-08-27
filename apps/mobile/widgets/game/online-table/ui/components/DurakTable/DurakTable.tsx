import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameResult } from '@/entities/game-table';
import { ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { DurakTableProps } from './DurakTable.types';

import { useDurakTable } from '../../../model';
import { OpponentsRow } from '../OpponentsRow';
import { PlayerZone } from '../PlayerZone';
import { TableCenter } from '../TableCenter';
import { styles } from './DurakTable.styles';

export const DurakTable = ({ game, settings, view, phrases, onLeave }: DurakTableProps) => {
  const insets = useSafeAreaInsets();

  const {
    drag,
    profile,
    cardScale,
    handSort,
    showHints,
    isInstant,
    sendEmoji,
    sendPhrase,
    setReady,
    handleBoost
  } = useDurakTable({ game });

  const { mySeat } = game;

  return (
    <FeltBackground style={styles.root}>
      <ContentWidth
        maxWidth={TABLE_MAX_WIDTH}
        style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <OpponentsRow
          mySeat={mySeat}
          phrases={phrases}
          players={game.players}
          turnSeconds={settings.turnTimeoutSeconds}
          view={view}
        />

        <TableCenter
          beatableIndexes={drag.targets ?? game.beatableIndexes}
          cardScale={cardScale}
          hoveredIndex={drag.hoveredIndex}
          isInstant={isInstant}
          view={view}
          onDefend={game.defendPair}
          onZonesChange={drag.setDropZones}
        />

        <PlayerZone
          canPass={game.canPass}
          canTake={game.canTake}
          cardScale={cardScale}
          chatter={profile ? phrases[profile.userId] : undefined}
          dropZones={drag.dropZones}
          hasHints={showHints}
          isInstant={isInstant}
          isMyTurn={game.isMyTurn}
          playableKeys={game.playableKeys}
          profile={profile}
          selectedKey={game.selectedKey}
          sortMode={handSort}
          turnSeconds={settings.turnTimeoutSeconds}
          view={view}
          onDragEnd={drag.end}
          onDragStart={drag.start}
          onDropMiss={drag.dropMissed}
          onDropOn={drag.dropOn}
          onHover={drag.hover}
          onLeave={onLeave}
          onPass={game.pass}
          onSelectCard={game.selectCard}
          onSendEmoji={sendEmoji}
          onSendPhrase={sendPhrase}
          onTake={game.take}
          onUseBoost={handleBoost}
        />

        {game.outcome && (
          <GameResult
            creditsDelta={game.outcome.creditsDelta}
            isDraw={game.outcome.isDraw}
            isLoser={game.outcome.loserUserId === view.players[mySeat]?.userId}
            ratingDelta={game.outcome.ratingDelta}
            onExit={onLeave}
            onRestart={() => setReady(true)}
          />
        )}
      </ContentWidth>
    </FeltBackground>
  );
};
