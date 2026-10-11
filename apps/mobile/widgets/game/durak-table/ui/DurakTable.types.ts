import type { TableSettings } from '@durak-master/schemas';

export type DurakTableProps = {
  settings: TableSettings;
  onInviteFriends: () => void;
  onLeave: () => void;
  onSelectPlayer: (userId: string) => void;
};
