'use client';

import { useSessionStore } from '@/entities/session';
import { AppShell } from '@/views/app-shell';
import { OnlineTable } from '@/widgets/game/online-table';

const HomePage = () => {
  const currentTable = useSessionStore((store) => store.currentTable);

  // За столом показываем игру, иначе — лобби.
  return currentTable ? <OnlineTable /> : <AppShell />;
};

export default HomePage;
