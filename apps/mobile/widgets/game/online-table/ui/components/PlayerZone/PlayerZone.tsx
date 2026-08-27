import { View } from 'react-native';

import { PlayerHand } from '@/entities/game-table';

import type { PlayerZoneProps } from './PlayerZone.types';

import { useTableContext } from '../../../model';
import { TableActions } from '../TableActions';
import { styles } from './PlayerZone.styles';

export const PlayerZone = ({ view }: PlayerZoneProps) => {
  const { look, turn, drag, moves } = useTableContext();

  return (
    <View style={styles.root}>
      <PlayerHand
        cards={view.hand}
        cardScale={look.cardScale}
        dropZones={drag.dropZones}
        hasHints={look.hasHints}
        isInstant={look.isInstant}
        playableKeys={turn.playableKeys}
        selectedKey={turn.selectedKey}
        sortMode={look.sortMode}
        trump={view.trump}
        onDragEnd={drag.onDragEnd}
        onDragStart={drag.onDragStart}
        onDropMiss={drag.onDropMiss}
        onDropOn={drag.onDropOn}
        onHover={drag.onHover}
        onSelect={moves.onSelectCard}
      />

      <TableActions turnDeadline={view.turnDeadline} />
    </View>
  );
};
