import { useSessionStore } from '@/entities/session';
import { AppShell } from '@/views/app-shell';
import { OnlineTable } from '@/widgets/game/online-table';

const HomeScreen = () => {
  const currentTable = useSessionStore((store) => store.currentTable);

  return currentTable ? <OnlineTable /> : <AppShell />;
};

export default HomeScreen;
