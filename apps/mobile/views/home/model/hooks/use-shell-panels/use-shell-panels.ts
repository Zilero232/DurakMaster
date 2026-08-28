import { useState } from 'react';

export type ShellPanel =
  'achievements' | 'friends' | 'leaderboard' | 'profileEditor' | 'rules' | 'settings' | 'stats';

export const useShellPanels = () => {
  const [panel, setPanel] = useState<ShellPanel | null>(null);

  return {
    panel,
    open: (next: ShellPanel) => setPanel(next),
    close: () => setPanel(null)
  };
};
