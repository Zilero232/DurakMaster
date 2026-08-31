import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { match } from 'ts-pattern';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { useSettingsStore } from '@/entities/settings';
import { SignInForm } from '@/features/auth/sign-in';
import { SignOutConfirm, useSignOut } from '@/features/auth/sign-out';
import { CreateTable } from '@/features/lobby/create-table';
import { useLayout } from '@/shared/model/layout';
import { ContentWidth, DESKTOP_MAX_WIDTH, LobbyBackground } from '@/ui-kit';
import { TableList } from '@/widgets/lobby/table-list';

import type { ShellTab } from './AppShell.types';

import { useLobbyConnection, useShellPanels, useTableJoin } from '../../model';
import { styles } from './AppShell.styles';
import { ProfileTab, ShellChrome, ShellLoading, ShellOverlays } from './components';

export const AppShell = () => {
  const insets = useSafeAreaInsets();

  const { isDesktop } = useLayout();

  const { isPending, session, status } = useLobbyConnection();
  const { isPasswordPromptOpen, join, confirmPassword, cancelPassword } = useTableJoin();
  const panels = useShellPanels();
  const signOut = useSignOut();

  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);

  const { profile } = useMyProfile();
  const createTable = useSessionStore((store) => store.createTable);
  const isJoiningTable = useSessionStore((store) => store.isJoiningTable);

  const [tab, setTab] = useState<ShellTab>('profile');

  if (isPending) {
    return <ShellLoading />;
  }

  if (!session) {
    return <SignInForm />;
  }

  const content = match(tab)
    .with('profile', () => <ProfileTab profile={profile} onOpenPanel={panels.open} />)
    .with('tables', () => <TableList onCreate={() => setTab('create')} onJoin={join} />)
    .with('create', () => <CreateTable isPending={isJoiningTable} onCreate={createTable} />)
    .exhaustive();

  return (
    <LobbyBackground isStatic={isBatterySaver} style={[styles.root, { paddingTop: insets.top }]}>
      <ContentWidth maxWidth={isDesktop ? DESKTOP_MAX_WIDTH : undefined} style={styles.column}>
        <ShellChrome status={status} tab={tab} onChange={setTab} onSignOut={signOut.request}>
          {content}
        </ShellChrome>
      </ContentWidth>

      <ShellOverlays
        isPasswordPromptOpen={isPasswordPromptOpen}
        openPanel={panels.panel}
        profile={profile}
        onClosePanel={panels.close}
        onClosePasswordPrompt={cancelPassword}
        onSubmitPassword={confirmPassword}
      />

      <SignOutConfirm
        isOpen={signOut.isConfirming}
        onCancel={signOut.cancel}
        onConfirm={signOut.confirm}
      />

      <View style={{ height: insets.bottom }} />
    </LobbyBackground>
  );
};
