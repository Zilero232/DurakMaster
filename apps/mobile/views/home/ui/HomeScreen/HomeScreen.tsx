import { useSessionStore } from '@/entities/session';

import { AppShell } from '../AppShell';
import { TableRouter } from '../TableRouter';

export const HomeScreen = () => {
  const currentTable = useSessionStore((store) => store.currentTable);

  return currentTable ? <TableRouter /> : <AppShell />;
};
