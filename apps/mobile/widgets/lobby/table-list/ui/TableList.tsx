import { PlugZap, Plus, SearchX } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { Button, colors, iconSize, SuitIcon } from '@/ui-kit';

import type { TableListProps } from './TableList.types';

import { useLobbyFilters } from '../model';
import { LobbyFilters, LobbyPlaceholder, TableGrid, TableListSkeleton } from './components';
import { styles } from './TableList.styles';

export const TableList = ({ onJoin, onCreate }: TableListProps) => {
  const { t } = useTranslation();

  const { profile } = useMyProfile();
  const myUserId = profile?.userId;
  const tables = useSessionStore((store) => store.tables);
  const status = useSessionStore((store) => store.status);
  const joiningTableId = useSessionStore((store) => store.joiningTableId);

  const filters = useLobbyFilters(tables);

  const isLoading = status === 'connecting' || status === 'idle';

  const body = match({
    isLoading,
    status,
    hasAny: tables.length > 0,
    hasVisible: filters.visible.length > 0
  })
    .with({ hasVisible: true }, () => (
      <TableGrid
        joiningTableId={joiningTableId}
        myUserId={myUserId}
        tables={filters.visible}
        onJoin={onJoin}
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
    .otherwise(() => (
      <LobbyPlaceholder
        action={
          <Button size='lg' variant='primary' onPress={onCreate}>
            <Plus color={colors.primaryForeground} size={iconSize.md} />
            <Text style={styles.emptyAction}>{t('lobby.createFirst')}</Text>
          </Button>
        }
        hint={t('lobby.emptyHint')}
        icon={<SuitIcon color={colors.subtleForeground} size={iconSize.hero} suit='spades' />}
        title={t('lobby.empty')}
      />
    ));

  return (
    <View style={styles.root}>
      {tables.length > 0 && (
        <LobbyFilters
          bet={filters.bet}
          count={filters.visible.length}
          hideFull={filters.hideFull}
          onChangeBet={filters.setBet}
          onToggleHideFull={filters.toggleHideFull}
        />
      )}

      {body}
    </View>
  );
};
