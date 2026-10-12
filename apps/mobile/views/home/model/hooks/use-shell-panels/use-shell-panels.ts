import { useState } from 'react';

import type { ShellPanel, UseShellPanelsInput } from './use-shell-panels.types';

export const useShellPanels = ({ isSignedIn }: UseShellPanelsInput) => {
  const [panel, setPanel] = useState<ShellPanel | null>(null);

  if (!isSignedIn && panel !== null) {
    setPanel(null);
  }

  return {
    panel,
    open: (next: ShellPanel) => setPanel(next),
    close: () => setPanel(null)
  };
};
