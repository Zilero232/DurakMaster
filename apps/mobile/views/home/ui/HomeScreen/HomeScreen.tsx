import { useSessionStore } from '@/entities/session';
import { OnlineTable } from '@/widgets/game/online-table';

import { AppShell } from '../AppShell';

export const HomeScreen = () => {
  const currentTable = useSessionStore((store) => store.currentTable);

  return currentTable ? <OnlineTable /> : <AppShell />;
};
