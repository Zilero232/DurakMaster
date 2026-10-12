import type { LobbyTable } from '@durak-master/schemas';

import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';

import { colors } from '@/ui-kit';

import type { TableGridProps } from './TableGrid.types';

import { TableRow } from '../TableRow';
import { styles } from './TableGrid.styles';

const keyExtractor = (table: LobbyTable) => table.id;

export const TableGrid = ({
  tables,
  myUserId,
  joiningTableId,
  isRefreshing,
  onJoin,
  onRefresh
}: TableGridProps) => {
  const isJoiningAny = joiningTableId !== null;

  return (
    <FlashList
      refreshControl={
        <RefreshControl
          colors={[colors.accent]}
          progressBackgroundColor={colors.surface2}
          refreshing={isRefreshing}
          tintColor={colors.accent}
          onRefresh={onRefresh}
        />
      }
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
