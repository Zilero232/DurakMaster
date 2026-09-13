import { useState } from 'react';

import type { ShellPanel } from './use-shell-panels.types';

export const useShellPanels = () => {
  const [panel, setPanel] = useState<ShellPanel | null>(null);

  return {
    panel,
    open: (next: ShellPanel) => setPanel(next),
    close: () => setPanel(null)
  };
};
