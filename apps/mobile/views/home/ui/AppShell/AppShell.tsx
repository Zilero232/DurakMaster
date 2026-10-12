import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { match } from 'ts-pattern';

import { useMyProfile, useSessionStore } from '@/entities/session';
import { useSettingsStore } from '@/entities/settings';
import { SignInForm } from '@/features/auth/sign-in';
import { CreateTable } from '@/features/lobby/create-table';
import { LobbyBackground } from '@/ui-kit';
import { TableList } from '@/widgets/lobby/table-list';

import type { ShellTab } from './AppShell.types';

import { useBackHandler, useLobbyConnection, useShellPanels, useTableJoin } from '../../model';
import { ProfileTab, ShellChrome, ShellLoading, ShellOverlays } from './components';

export const AppShell = () => {
  const insets = useSafeAreaInsets();

  const { isPending, session, status } = useLobbyConnection();
  const { isPasswordPromptOpen, join, confirmPassword, cancelPassword } = useTableJoin();
  const panels = useShellPanels({ isSignedIn: Boolean(session) });

  const isBatterySaver = useSettingsStore((store) => store.isBatterySaver);
  const createTable = useSessionStore((store) => store.createTable);
  const isJoiningTable = useSessionStore((store) => store.isJoiningTable);

  const { profile } = useMyProfile();

  const [tab, setTab] = useState<ShellTab>('profile');

  useBackHandler({ isEnabled: tab !== 'profile', onBack: () => setTab('profile') });

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
    <LobbyBackground isStatic={isBatterySaver} style={{ paddingTop: insets.top }}>
      <ShellChrome profile={profile} status={status} tab={tab} onChange={setTab}>
        {content}
      </ShellChrome>

      <ShellOverlays
        isPasswordPromptOpen={isPasswordPromptOpen}
        openPanel={panels.panel}
        profile={profile}
        onClosePanel={panels.close}
        onClosePasswordPrompt={cancelPassword}
        onSubmitPassword={confirmPassword}
      />
    </LobbyBackground>
  );
};
