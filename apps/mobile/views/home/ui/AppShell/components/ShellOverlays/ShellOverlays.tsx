import { PasswordPrompt } from '@/features/lobby/join-table';
import { SettingsPanel } from '@/features/settings/change-settings';
import { PlayerStats } from '@/widgets/profile/player-stats';
import { ProfileEditor } from '@/widgets/profile/profile-editor';
import { RulesPanel } from '@/widgets/rules/rules-panel';
import { AchievementsPanel } from '@/widgets/social/achievements-panel';
import { FriendsPanel } from '@/widgets/social/friends-panel';
import { LeaderboardPanel } from '@/widgets/social/leaderboard-panel';

import type { ShellOverlaysProps } from './ShellOverlays.types';

export const ShellOverlays = ({
  profile,
  openPanel,
  isPasswordPromptOpen,
  onClosePanel,
  onClosePasswordPrompt,
  onSubmitPassword
}: ShellOverlaysProps) => (
  <>
    <SettingsPanel isOpen={openPanel === 'settings'} onClose={onClosePanel} />

    <RulesPanel isOpen={openPanel === 'rules'} onClose={onClosePanel} />

    {profile && (
      <>
        <PlayerStats isOpen={openPanel === 'stats'} profile={profile} onClose={onClosePanel} />

        <ProfileEditor
          isOpen={openPanel === 'profileEditor'}
          profile={profile}
          onClose={onClosePanel}
        />
      </>
    )}

    <FriendsPanel isOpen={openPanel === 'friends'} onClose={onClosePanel} />

    <AchievementsPanel isOpen={openPanel === 'achievements'} onClose={onClosePanel} />

    <LeaderboardPanel isOpen={openPanel === 'leaderboard'} onClose={onClosePanel} />

    <PasswordPrompt
      isOpen={isPasswordPromptOpen}
      onClose={onClosePasswordPrompt}
      onSubmit={onSubmitPassword}
    />
  </>
);
