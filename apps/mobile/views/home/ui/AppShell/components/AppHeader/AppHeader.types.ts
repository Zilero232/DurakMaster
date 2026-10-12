import type { MyProfile } from '@durak-master/schemas';

import type { ConnectionStatus } from '@/entities/session';

export type AppHeaderProps = {
  profile: MyProfile | null;
  status: ConnectionStatus;
  onOpenProfile: () => void;
};
