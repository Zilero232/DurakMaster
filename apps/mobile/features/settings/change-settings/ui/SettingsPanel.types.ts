import type { ReactNode } from 'react';

export type SettingsPanelProps = {
  isOpen: boolean;
  signOutButton: ReactNode;
  onClose: () => void;
};
