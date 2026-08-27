import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSessionStore } from '@/entities/session';
import { SignInForm } from '@/features/auth/sign-in';
import { ContentWidth, screenGradient } from '@/ui-kit';

import type { ShellTab } from './AppShell.types';

import { useLobbyConnection, useShellPanels, useTableJoin } from '../../model';
import { styles } from './AppShell.styles';
import { AppHeader, ShellContent, ShellLoading, ShellOverlays, TabBar } from './components';

export const AppShell = () => {
  const insets = useSafeAreaInsets();

  const { isPending, session, status } = useLobbyConnection();
  const { tables, isPasswordPromptOpen, join, confirmPassword, cancelPassword } = useTableJoin();
  const panels = useShellPanels();

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
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={screenGradient} style={styles.wash} />

      <ContentWidth style={styles.column}>
        <AppHeader status={status} tab={tab} onOpenSettings={panels.open('settings')} />

        <View style={styles.content}>
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
            onOpenStats={panels.open('stats')}
          />
        </View>

        <TabBar tab={tab} onChange={setTab} />
      </ContentWidth>

      <ShellOverlays
        isPasswordPromptOpen={isPasswordPromptOpen}
        openPanel={panels.panel}
        profile={profile}
        onClosePanel={panels.close}
        onClosePasswordPrompt={cancelPassword}
        onSubmitPassword={confirmPassword}
      />

      <View style={{ height: insets.bottom }} />
    </View>
  );
};
