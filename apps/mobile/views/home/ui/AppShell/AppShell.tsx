import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSessionStore } from '@/entities/session';
import { SignInForm } from '@/features/auth/sign-in';
import { SignOutConfirm, useSignOut } from '@/features/auth/sign-out';
import { useLayout } from '@/shared/model/layout';
import { ContentWidth, DESKTOP_MAX_WIDTH, LobbyBackground } from '@/ui-kit';

import type { ShellTab } from './AppShell.types';

import { useLobbyConnection, useShellPanels, useTableJoin } from '../../model';
import { styles } from './AppShell.styles';
import { ShellChrome, ShellContent, ShellLoading, ShellOverlays } from './components';

export const AppShell = () => {
  const insets = useSafeAreaInsets();

  const { isDesktop } = useLayout();

  const { isPending, session, status } = useLobbyConnection();
  const { tables, isPasswordPromptOpen, join, confirmPassword, cancelPassword } = useTableJoin();
  const panels = useShellPanels();
  const signOut = useSignOut();

  const profile = useSessionStore((store) => store.profile);
  const createTable = useSessionStore((store) => store.createTable);
  const claimBonus = useSessionStore((store) => store.claimBonus);

  const [tab, setTab] = useState<ShellTab>('profile');

  if (isPending) {
    return <ShellLoading />;
  }

  if (!session) {
    return <SignInForm />;
  }

  return (
    <LobbyBackground style={[styles.root, { paddingTop: insets.top }]}>
      <ContentWidth maxWidth={isDesktop ? DESKTOP_MAX_WIDTH : undefined} style={styles.column}>
        <ShellChrome status={status} tab={tab} onChange={setTab} onSignOut={signOut.request}>
          <ShellContent
            profile={profile}
            status={status}
            tab={tab}
            tables={tables}
            onClaimBonus={claimBonus}
            onCreateTable={createTable}
            onGoToCreate={() => setTab('create')}
            onJoin={join}
            onOpenAchievements={panels.open('achievements')}
            onOpenFriends={panels.open('friends')}
            onOpenLeaderboard={panels.open('leaderboard')}
            onOpenProfileEditor={panels.open('profileEditor')}
            onOpenRules={panels.open('rules')}
            onOpenSettings={panels.open('settings')}
            onOpenStats={panels.open('stats')}
          />
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
