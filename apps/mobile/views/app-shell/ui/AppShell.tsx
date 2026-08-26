import { useBoolean } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSessionStore } from '@/entities/session';
import { SignInForm } from '@/features/auth/sign-in';
import { CreateTable } from '@/features/lobby/create-table';
import { PasswordPrompt } from '@/features/lobby/join-table';
import { SettingsPanel } from '@/features/settings/change-settings';
import { useSession } from '@/shared/api';
import { TableList } from '@/widgets/lobby/table-list';
import { ProfileMenu } from '@/widgets/profile/profile-menu';
import { WalletBar } from '@/widgets/profile/wallet-bar';
import { RulesPanel } from '@/widgets/rules/rules-panel';

import type { ShellTab } from './AppShell.types';

import { styles } from './AppShell.styles';
import { AppHeader, TabBar } from './components';

export const AppShell = () => {
  const insets = useSafeAreaInsets();

  const { data: session, isPending } = useSession();

  const status = useSessionStore((store) => store.status);
  const profile = useSessionStore((store) => store.profile);
  const tables = useSessionStore((store) => store.tables);
  const connect = useSessionStore((store) => store.connect);
  const subscribeLobby = useSessionStore((store) => store.subscribeLobby);
  const createTable = useSessionStore((store) => store.createTable);
  const joinTable = useSessionStore((store) => store.joinTable);
  const claimBonus = useSessionStore((store) => store.claimBonus);

  const [tab, setTab] = useState<ShellTab>('profile');
  const [isSettingsOpen, toggleSettings] = useBoolean(false);
  const [isRulesOpen, toggleRules] = useBoolean(false);
  const [pendingTableId, setPendingTableId] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      void connect();
    }
  }, [session, connect]);

  useEffect(() => {
    if (status === 'connected') {
      subscribeLobby();
    }
  }, [status, subscribeLobby]);

  const handleJoin = (tableId: string) => {
    const table = tables.find((item) => item.id === tableId);

    if (table?.settings.isPrivate) {
      setPendingTableId(tableId);

      return;
    }

    joinTable(tableId);
  };

  if (isPending) {
    return <View style={styles.root} />;
  }

  if (!session) {
    return <SignInForm />;
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <AppHeader
        status={status}
        tab={tab}
        onOpenSettings={() => {
          toggleSettings(true);
        }}
      />

      <View style={styles.content}>
        {tab === 'profile' && profile && (
          <ScrollView contentContainerStyle={styles.profile} showsVerticalScrollIndicator={false}>
            <WalletBar profile={profile} onClaimBonus={claimBonus} />

            <ProfileMenu
              onOpenRules={() => {
                toggleRules(true);
              }}
              onOpenSettings={() => {
                toggleSettings(true);
              }}
              onQuickGame={() => {
                setTab('tables');
              }}
            />
          </ScrollView>
        )}

        {tab === 'tables' && <TableList tables={tables} onJoin={handleJoin} />}
        {tab === 'create' && <CreateTable onCreate={createTable} />}
      </View>

      <TabBar tab={tab} onChange={setTab} />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => {
          toggleSettings(false);
        }}
      />

      <RulesPanel
        isOpen={isRulesOpen}
        onClose={() => {
          toggleRules(false);
        }}
      />

      <PasswordPrompt
        isOpen={pendingTableId !== null}
        onClose={() => {
          setPendingTableId(null);
        }}
        onSubmit={(password) => {
          if (pendingTableId) {
            joinTable(pendingTableId, password);
            setPendingTableId(null);
          }
        }}
      />

      <View style={{ height: insets.bottom }} />
    </View>
  );
};
