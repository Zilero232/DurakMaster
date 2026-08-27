import type { ShellTab } from '../../AppShell.types';

export type TabBarProps = {
  tab: ShellTab;
  onChange: (tab: ShellTab) => void;
};
