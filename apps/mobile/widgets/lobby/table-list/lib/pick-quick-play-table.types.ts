import type { LobbyTable } from '@durak-master/schemas';

export type PickQuickPlayTableInput = {
  tables: LobbyTable[];
  credits: number;
  myUserId: string;
};
