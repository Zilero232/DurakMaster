import { useBoolean } from '@siberiacancode/reactuse';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOnlineGame, useSessionStore } from '@/entities/session';
import { DiscardPanel } from '@/features/game/view-discard';
import { SettingsPanel } from '@/features/settings/change-settings';

import {
  GameResult,
  PlayerHand,
  TableField,
  TalonStack,
  TurnTimer
} from '../../game-table/ui/components';
import { getStatusKey } from '../lib/status';
import { useLatestPhrases } from '../model/use-latest-phrases';
import { useTableSounds } from '../model/use-table-sounds';
import { OpponentsRow, TableActions, WaitingRoom } from './components';
import { styles } from './OnlineTable.styles';

export const OnlineTable = () => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const currentTable = useSessionStore((store) => store.currentTable);
  const leaveTable = useSessionStore((store) => store.leaveTable);
  const setReady = useSessionStore((store) => store.setReady);
  const addBot = useSessionStore((store) => store.addBot);
  const sendPhrase = useSessionStore((store) => store.sendPhrase);

  const [isDiscardOpen, toggleDiscard] = useBoolean(false);
  const [isSettingsOpen, toggleSettings] = useBoolean(false);

  const game = useOnlineGame();
  const phrases = useLatestPhrases();

  useTableSounds(game.view, game.isMyTurn);

  const { view, mySeat } = game;

  if (!currentTable) {
    return null;
  }

  if (!view) {
    return (
      <WaitingRoom
        mySeat={mySeat}
        table={currentTable}
        onAddBot={addBot}
        onLeave={leaveTable}
        onReady={setReady}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <OpponentsRow mySeat={mySeat} phrases={phrases} players={game.players} view={view} />

      <View style={styles.middle}>
        <TalonStack count={view.talonCount} trump={view.trump} trumpCard={view.trumpCard} />

        <TableField
          beatableIndexes={game.beatableIndexes}
          pairs={view.table}
          onDefend={game.defendPair}
        />
      </View>

      <View style={styles.bottom}>
        <View style={styles.statusRow}>
          <Text numberOfLines={1} style={[styles.status, game.isMyTurn && styles.statusActive]}>
            {t(getStatusKey(game))}
          </Text>

          {game.isMyTurn && (
            <TurnTimer
              deadline={view.turnDeadline}
              totalSeconds={view.settings.turnTimeoutSeconds}
            />
          )}
        </View>

        <PlayerHand
          cards={view.hand}
          playableKeys={game.playableKeys}
          selectedKey={game.selectedKey}
          trump={view.trump}
          onSelect={game.selectCard}
        />

        <TableActions
          canPass={game.canPass}
          canTake={game.canTake}
          discardCount={view.discardCount}
          onOpenDiscard={() => {
            toggleDiscard(true);
          }}
          onOpenSettings={() => {
            toggleSettings(true);
          }}
          onPass={game.pass}
          onSendPhrase={sendPhrase}
          onTake={game.take}
        />
      </View>

      <DiscardPanel
        cards={view.discardPile}
        isOpen={isDiscardOpen}
        onClose={() => {
          toggleDiscard(false);
        }}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => {
          toggleSettings(false);
        }}
      />

      {game.outcome && (
        <GameResult
          creditsDelta={game.outcome.creditsDelta}
          isDraw={game.outcome.isDraw}
          isLoser={game.outcome.loserUserId === view.players[mySeat]?.userId}
          ratingDelta={game.outcome.ratingDelta}
          onExit={leaveTable}
        />
      )}
    </View>
  );
};
