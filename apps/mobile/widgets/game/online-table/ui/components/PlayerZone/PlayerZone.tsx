import { View } from 'react-native';

import { PlayerHand } from '@/entities/game-table';

import type { PlayerZoneProps } from './PlayerZone.types';

import { TableActions } from '../TableActions';
import { styles } from './PlayerZone.styles';

export const PlayerZone = ({
  view,
  profile,
  chatter,
  turnSeconds,
  isMyTurn,
  hasHints,
  sortMode,
  cardScale,
  isInstant,
  dropZones,
  playableKeys,
  selectedKey,
  canPass,
  canTake,
  onDropOn,
  onDropMiss,
  onHover,
  onDragStart,
  onDragEnd,
  onSelectCard,
  onPass,
  onTake,
  onSendPhrase,
  onSendEmoji,
  onUseBoost,
  onLeave
}: PlayerZoneProps) => (
  <View style={styles.root}>
    <PlayerHand
      cards={view.hand}
      cardScale={cardScale}
      dropZones={dropZones}
      hasHints={hasHints}
      isInstant={isInstant}
      playableKeys={playableKeys}
      selectedKey={selectedKey}
      sortMode={sortMode}
      trump={view.trump}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDropMiss={onDropMiss}
      onDropOn={onDropOn}
      onHover={onHover}
      onSelect={onSelectCard}
    />

    <TableActions
      canPass={canPass}
      canTake={canTake}
      chatter={chatter}
      isMyTurn={isMyTurn}
      profile={profile}
      turnDeadline={view.turnDeadline}
      turnSeconds={turnSeconds}
      onLeave={onLeave}
      onPass={onPass}
      onSendEmoji={onSendEmoji}
      onSendPhrase={onSendPhrase}
      onTake={onTake}
      onUseBoost={onUseBoost}
    />
  </View>
);
