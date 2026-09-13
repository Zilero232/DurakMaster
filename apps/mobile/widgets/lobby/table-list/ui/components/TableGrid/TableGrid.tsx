import type { LobbyTable } from '@durak-master/schemas';

import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import type { TableGridProps } from './TableGrid.types';

import { TableRow } from '../TableRow';
import { COLUMN_WIDTH } from './TableGrid.config';
import { styles } from './TableGrid.styles';

const columnsFor = (width: number): number => Math.max(1, Math.floor(width / COLUMN_WIDTH));

const keyExtractor = (table: LobbyTable) => table.id;

export const TableGrid = ({
  tables,
  myUserId,
  joiningTableId,
  isDesktop,
  width,
  onJoin
}: TableGridProps) => (
  <FlashList
    renderItem={({ item }) => (
      <View style={isDesktop && styles.cell}>
        <TableRow
          isPending={item.id === joiningTableId}
          isTile={isDesktop}
          myUserId={myUserId}
          table={item}
          onJoin={onJoin}
        />
      </View>
    )}
    contentContainerStyle={isDesktop ? styles.desktopList : styles.list}
    data={tables}
    keyExtractor={keyExtractor}
    numColumns={isDesktop ? columnsFor(width) : 1}
    showsVerticalScrollIndicator={false}
  />
);
