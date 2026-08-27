import type { LobbyTable } from '@durak-master/schemas';

import { FlashList } from '@shopify/flash-list';
import { PlugZap, Plus, SearchX } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { Button, colors, iconSize, SuitIcon } from '@/ui-kit';

import type { TableListProps } from './TableList.types';

import { useLobbyFilters } from '../model';
import { LobbyFilters, TableListSkeleton, TableRow } from './components';
import { styles } from './TableList.styles';

const keyExtractor = (table: LobbyTable) => table.id;

export const TableList = ({ tables, status, onJoin, onCreate }: TableListProps) => {
  const { t } = useTranslation();

  const filters = useLobbyFilters(tables);

  const isLoading = status === 'connecting' || status === 'idle';

  const body = match({
    isLoading,
    status,
    hasAny: tables.length > 0,
    hasVisible: filters.visible.length > 0
  })
    .with({ hasVisible: true }, () => (
      <FlashList
        contentContainerStyle={styles.list}
        data={filters.visible}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <TableRow table={item} onJoin={onJoin} />}
        showsVerticalScrollIndicator={false}
      />
    ))

    .with({ hasAny: true }, () => (
      <View style={styles.empty}>
        <SearchX color={colors.subtleForeground} size={iconSize.hero} />

        <Text style={styles.emptyTitle}>{t('lobby.nothingMatches')}</Text>
        <Text style={styles.emptyHint}>{t('lobby.nothingMatchesHint')}</Text>
      </View>
    ))
    .with({ isLoading: true }, () => <TableListSkeleton />)
    .with({ status: 'error' }, () => (
      <View style={styles.empty}>
        <PlugZap color={colors.subtleForeground} size={iconSize.hero} />

        <Text style={styles.emptyTitle}>{t('lobby.offline')}</Text>
        <Text style={styles.emptyHint}>{t('lobby.offlineHint')}</Text>
      </View>
    ))
    .otherwise(() => (
      <View style={styles.empty}>
        <SuitIcon color={colors.subtleForeground} size={iconSize.hero} suit='spades' />

        <Text style={styles.emptyTitle}>{t('lobby.empty')}</Text>
        <Text style={styles.emptyHint}>{t('lobby.emptyHint')}</Text>

        <Button size='lg' variant='primary' onPress={onCreate}>
          <Plus color={colors.primaryForeground} size={iconSize.md} />
          <Text style={styles.emptyAction}>{t('lobby.createFirst')}</Text>
        </Button>
      </View>
    ));

  return (
    <View style={styles.root}>
      {tables.length > 0 && (
        <LobbyFilters
          bet={filters.bet}
          count={filters.visible.length}
          game={filters.game}
          hideFull={filters.hideFull}
          onChangeBet={filters.setBet}
          onChangeGame={filters.setGame}
          onToggleHideFull={filters.toggleHideFull}
        />
      )}

      {body}
    </View>
  );
};
