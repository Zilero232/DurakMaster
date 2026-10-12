import { PlugZap, SearchX } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { match } from 'ts-pattern';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { colors, iconSize } from '@/ui-kit';

import type { TableListProps } from './TableList.types';

import { useLobbyFilters, useLobbyRefresh, useQuickPlay } from '../model';
import {
  EmptyLobby,
  LobbyFilters,
  LobbyPlaceholder,
  QuickPlayButton,
  TableGrid,
  TableListSkeleton
} from './components';
import { styles } from './TableList.styles';

export const TableList = ({ onJoin, onCreate }: TableListProps) => {
  const { t } = useTranslation();

  const tables = useSessionStore((store) => store.tables);
  const status = useSessionStore((store) => store.status);
  const joiningTableId = useSessionStore((store) => store.joiningTableId);

  const { profile } = useMyProfile();
  const filters = useLobbyFilters(tables);
  const { isRefreshing, refresh } = useLobbyRefresh();
  const { canQuickPlay, quickPlay } = useQuickPlay({ onCreate, onJoin });

  const isLoading = status === 'connecting' || status === 'idle';
  const hasTables = tables.length > 0;

  const body = match({
    isLoading,
    status,
    hasAny: hasTables,
    hasVisible: filters.visible.length > 0
  })
    .with({ hasVisible: true }, () => (
      <TableGrid
        isRefreshing={isRefreshing}
        joiningTableId={joiningTableId}
        myUserId={profile?.userId}
        tables={filters.visible}
        onJoin={onJoin}
        onRefresh={refresh}
      />
    ))
    .with({ hasAny: true }, () => (
      <LobbyPlaceholder
        hint={t('lobby.nothingMatchesHint')}
        icon={<SearchX color={colors.subtleForeground} size={iconSize.hero} />}
        title={t('lobby.nothingMatches')}
      />
    ))
    .with({ isLoading: true }, () => <TableListSkeleton />)
    .with({ status: 'error' }, () => (
      <LobbyPlaceholder
        hint={t('lobby.offlineHint')}
        icon={<PlugZap color={colors.subtleForeground} size={iconSize.hero} />}
        title={t('lobby.offline')}
      />
    ))
    .otherwise(() => <EmptyLobby onCreate={onCreate} />);

  return (
    <View style={styles.root}>
      {hasTables && (
        <>
          <QuickPlayButton isDisabled={!canQuickPlay} onPress={quickPlay} />

          <LobbyFilters
            bet={filters.bet}
            count={filters.visible.length}
            hideFull={filters.hideFull}
            onChangeBet={filters.setBet}
            onToggleHideFull={filters.toggleHideFull}
          />
        </>
      )}

      {body}
    </View>
  );
};
