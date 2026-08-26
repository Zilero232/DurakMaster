import type { LobbyTable } from '@durak-master/schemas';

import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { TableListProps } from './TableList.types';

import { TableRow } from './components';
import { styles } from './TableList.styles';

const keyExtractor = (table: LobbyTable) => table.id;

export const TableList = ({ tables, onJoin }: TableListProps) => {
  const { t } = useTranslation();

  if (tables.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>{t('lobby.empty')}</Text>
        <Text style={styles.emptyHint}>{t('lobby.emptyHint')}</Text>
      </View>
    );
  }

  return (
    <FlashList
      contentContainerStyle={styles.list}
      data={tables}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => <TableRow table={item} onJoin={onJoin} />}
      showsVerticalScrollIndicator={false}
    />
  );
};
