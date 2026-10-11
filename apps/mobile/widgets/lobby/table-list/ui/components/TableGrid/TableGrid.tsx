import type { LobbyTable } from '@durak-master/schemas';

import { FlashList } from '@shopify/flash-list';

import type { TableGridProps } from './TableGrid.types';

import { TableRow } from '../TableRow';
import { styles } from './TableGrid.styles';

const keyExtractor = (table: LobbyTable) => table.id;

export const TableGrid = ({ tables, myUserId, joiningTableId, onJoin }: TableGridProps) => {
  const isJoiningAny = joiningTableId !== null;

  return (
    <FlashList
      renderItem={({ item }) => (
        <TableRow
          isDisabled={isJoiningAny}
          isPending={item.id === joiningTableId}
          myUserId={myUserId}
          table={item}
          onJoin={onJoin}
        />
      )}
      contentContainerStyle={styles.list}
      data={tables}
      extraData={joiningTableId}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
    />
  );
};
