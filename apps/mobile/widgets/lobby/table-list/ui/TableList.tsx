import type { LobbyTable } from '@durak-master/schemas';

import { FlashList } from '@shopify/flash-list';
import { PlugZap, Plus, SearchX } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { useLayout } from '@/shared/model/layout';
import { Button, colors, iconSize, SuitIcon } from '@/ui-kit';

import type { TableListProps } from './TableList.types';

import { useLobbyFilters } from '../model';
import { LobbyFilters, TableListSkeleton, TableRow } from './components';
import { styles } from './TableList.styles';

const COLUMN_WIDTH = 480;

const columnsFor = (width: number): number => Math.max(1, Math.floor(width / COLUMN_WIDTH));

const keyExtractor = (table: LobbyTable) => table.id;

export const TableList = ({ onJoin, onCreate }: TableListProps) => {
  const { t } = useTranslation();

  const { isDesktop } = useLayout();

  const { profile } = useMyProfile();
  const myUserId = profile?.userId;
  const tables = useSessionStore((store) => store.tables);
  const status = useSessionStore((store) => store.status);

  const [listWidth, setListWidth] = useState(0);

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
        renderItem={({ item }) => (
          <View style={isDesktop && styles.cell}>
            <TableRow isTile={isDesktop} myUserId={myUserId} table={item} onJoin={onJoin} />
          </View>
        )}
        contentContainerStyle={isDesktop ? styles.desktopList : styles.list}
        data={filters.visible}
        keyExtractor={keyExtractor}
        numColumns={isDesktop ? columnsFor(listWidth) : 1}
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
    <View style={styles.root} onLayout={(event) => setListWidth(event.nativeEvent.layout.width)}>
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
